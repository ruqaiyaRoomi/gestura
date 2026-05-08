import { ref, onMounted, onUnmounted } from "vue";

export function useGesture(videoRef) {
  // Store the accumulated translated text output
  const predictedText = ref("");
  const noHandDetected = ref(false);

  let interval = null;
  let cameraInstance = null;
  let handsInstance = null;

  async function extractLandmarks() {
    // Dynamically import MediaPipe Hands and Camera utilities
    const { Hands } = await import("@mediapipe/hands");
    const { Camera } = await import("@mediapipe/camera_utils");
    // Initialise MediaPipe Hands with CDN hostes model files
    handsInstance = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    // Configure detection settings
    handsInstance.setOptions({
      maxNumHands: 1, // only detect one hand at a time
      modelComplexity: 1, // full model complexity for accuracy
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    let latestLandmarks = null;
    let isLeft = false;
    let intervalStarted = false;

    // Callback fired each time MediaPipe processes a frame
    handsInstance.onResults((results) => {
      if (
        results.multiHandLandmarks?.length > 0 &&
        results.multiHandedness?.length > 0 &&
        results.multiHandedness[0].score > 0.8
      ) // Only accept high-confidence detections
      {
        noHandDetected.value = false;
        const hand = results.multiHandLandmarks[0];

        // Check if detected hand is left for x-axis mirroring
        isLeft = results.multiHandedness[0].label === "Left";
        // Flatten 21 landmarks (x, y, z) into a single array of 63 values
        latestLandmarks = hand.map((lm) => [lm.x, lm.y, lm.z]).flat();
        // Start prediction interval only once landmarks are available
        if (!intervalStarted) {
          intervalStarted = true;
          startInterval();
        }
      } else {
        // No hand detected in frame
        latestLandmarks = null;
        noHandDetected.value = true;
      }
    });
    // Hold count variables for gesture consistency validation
    let holdCount = 0;
    let lastSeenLabel = null;
    let letterLocked = false;
    let lastFrameTime = 0;
    // Initialise camera and throttle frame processing to every 100ms
    cameraInstance = new Camera(videoRef.value, {
      onFrame: async () => {
        const now = Date.now();
        if (now - lastFrameTime < 100) return; // Skip frame if called too soon (throttling)
        lastFrameTime = now;
        await handsInstance.send({ image: videoRef.value });
      },
    });

   await cameraInstance.start();

    function startInterval() {
      if (interval) return;
      // Poll for predictions every 200ms
      interval = setInterval(async () => {
        if (!latestLandmarks) {
          // reset hold count if no hand is present
          noHandDetected.value = true;
          holdCount = 0;
          lastSeenLabel = null;
          return;
        }
        try {
          // send landmarks to backend ML prediction endpoint
          const response = await fetch(
            "https://gestura-backend-production.up.railway.app/gestura/predict",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                landmarks: latestLandmarks,
                is_left: isLeft,
              }),
            },
          );
          const data = await response.json();

          if (data.confidence >= 85) {
            if (data.label === lastSeenLabel) {
              // Same label seen again - increment hold count
              if (!letterLocked) holdCount++;
            } else {
              // New label detected - reset hold count
              holdCount = 1;
              lastSeenLabel = data.label;
              letterLocked = false;
            }
            // register letter only after 2 consistent predictions
            if (holdCount >= 2 && !letterLocked) {
              letterLocked = true;
              holdCount = 0;
              // append letter to output, replace 'space' with underscore
              predictedText.value += data.label === "space" ? "_" : data.label;
            }
          } else {
            //Confidence too low - reset hold count
            holdCount = 0;
          }
        } catch (err) {
          console.error("prediction error", err);
        }
      }, 200);
    }
  }

  function startDetection() {
   return extractLandmarks();
  }

  function stopDetection() {
    //Clear prediction interval
    if (interval) {
      clearInterval(interval);
      interval = null;
    }

    // stop and release camera
    if (cameraInstance) {
      cameraInstance.stop();
      cameraInstance = null;
    }
    // close and release MediaPipe Hands instance
    if (handsInstance) {
      handsInstance.close();
      handsInstance = null;
    }
  }
  // Automatically stop detection when component is unmounted
  onUnmounted(() => stopDetection());

  return { predictedText, noHandDetected, startDetection, stopDetection };
}
