const useSound = () => {
  const playSound = () => {
    const audio = new Audio(
      "https://utfs.io/f/20627329-744d-4871-9621-a45168b213d1-7d0qup.mp3"
    ); // Path to your audio file
    audio.volume = 0.5;
    audio.play();
  };

  return { playSound };
};

export default useSound;
