
export interface AmbientSound {
  id: string;
  label: string;
  emoji: string;
}

export const ambientSounds: AmbientSound[] = [
  { id: "bedroom", label: "🧘 Bedroom Lofi", emoji: "🏠" },
  { id: "rain", label: "🌧️ Raindrops", emoji: "🌧️" },
  { id: "waves", label: "🌊 Ocean Waves", emoji: "🌊" },
  { id: "bowl", label: "🔔 Singing Bowl", emoji: "🔔" },
  { id: "forest", label: "🌿 Forest", emoji: "🌿" },
  { id: "wind", label: "🍃 Gentle Wind", emoji: "🍃" },
];

export const createAmbientSound = (type: string, audioCtx: AudioContext): (() => void) => {
  if (type === "bedroom") {
    // Bedroom Lofi: Combined soft brown noise and subtle low-frequency pulses
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    
    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 60; // Deep hum
    
    const gain = audioCtx.createGain();
    gain.gain.value = 0.08;
    
    const lfo = audioCtx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.05;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain).connect(gain.gain);

    noise.connect(filter).connect(gain).connect(audioCtx.destination);
    osc.connect(gain).connect(audioCtx.destination);
    
    noise.start();
    osc.start();
    lfo.start();
    return () => { 
      noise.stop(); 
      osc.stop(); 
      lfo.stop();
    };
  }

  if (type === "rain") {
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800;
    filter.Q.value = 0.5;
    const gain = audioCtx.createGain();
    gain.gain.value = 0.12;
    whiteNoise.connect(filter).connect(gain).connect(audioCtx.destination);
    whiteNoise.start();
    return () => { whiteNoise.stop(); };
  }
  
  if (type === "waves") {
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 500;
    const gain = audioCtx.createGain();
    gain.gain.value = 0.15;
    const lfo = audioCtx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.1;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 0.1;
    lfo.connect(lfoGain).connect(gain.gain);
    lfo.start();
    whiteNoise.connect(filter).connect(gain).connect(audioCtx.destination);
    whiteNoise.start();
    return () => { whiteNoise.stop(); lfo.stop(); };
  }
  
  if (type === "bowl") {
    const osc1 = audioCtx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 256;
    const osc2 = audioCtx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 384;
    const osc3 = audioCtx.createOscillator();
    osc3.type = "sine";
    osc3.frequency.value = 512;
    const gain = audioCtx.createGain();
    gain.gain.value = 0.06;
    const lfo = audioCtx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.3;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain).connect(gain.gain);
    osc1.connect(gain);
    osc2.connect(gain);
    osc3.connect(gain);
    gain.connect(audioCtx.destination);
    osc1.start(); osc2.start(); osc3.start(); lfo.start();
    return () => { osc1.stop(); osc2.stop(); osc3.stop(); lfo.stop(); };
  }
  
  if (type === "forest") {
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2000;
    filter.Q.value = 0.3;
    const gain = audioCtx.createGain();
    gain.gain.value = 0.06;
    whiteNoise.connect(filter).connect(gain).connect(audioCtx.destination);
    whiteNoise.start();
    return () => { whiteNoise.stop(); };
  }
  
  // Wind (default fallback)
  const bufferSize = 2 * audioCtx.sampleRate;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  const whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 300;
  const gain = audioCtx.createGain();
  gain.gain.value = 0.1;
  const lfo = audioCtx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.15;
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 0.06;
  lfo.connect(lfoGain).connect(gain.gain);
  lfo.start();
  whiteNoise.connect(filter).connect(gain).connect(audioCtx.destination);
  whiteNoise.start();
  return () => { whiteNoise.stop(); lfo.stop(); };
};
