export const moods = [
  { id: 1, name: 'Happy', file: '1_Happy.png' },
  { id: 2, name: 'Sad', file: '2_Sad.png' },
  { id: 3, name: 'Angry', file: '3_Angry.png' },
  { id: 4, name: 'Anxious', file: '4_Anxious.png' },
  { id: 5, name: 'Stressed', file: '5_Stressed.png' },
  { id: 6, name: 'Calm', file: '6_Calm.png' },
  { id: 7, name: 'Excited', file: '7_Excited.png' },
  { id: 8, name: 'Bored', file: '8_Bored.png' },
  { id: 9, name: 'Tired', file: '9_Tired.png' },
  { id: 10, name: 'Energetic', file: '10_Energetic.png' },
  { id: 11, name: 'Motivated', file: '11_Motivated.png' },
  { id: 12, name: 'Unmotivated', file: '12_Unmotivated.png' },
  { id: 13, name: 'Focused', file: '13_Focused.png' },
  { id: 14, name: 'Distracted', file: '14_Distracted.png' },
  { id: 15, name: 'Confused', file: '15_Confused.png' },
  { id: 16, name: 'Overwhelmed', file: '16_Overwhelmed.png' },
  { id: 17, name: 'Relaxed', file: '17_Relaxed.png' },
  { id: 18, name: 'Lonely', file: '18_Lonely.png' },
  { id: 19, name: 'Hopeful', file: '19_Hopeful.png' },
  { id: 20, name: 'Grateful', file: '20_Grateful.png' },
  { id: 21, name: 'Frustrated', file: '21_Frustrated.png' },
  { id: 22, name: 'Irritated', file: '22_Irritated.png' },
  { id: 23, name: 'Confident', file: '23_Confident.png' },
  { id: 24, name: 'Nervous', file: '24_Nervous.png' },
  { id: 25, name: 'Scared', file: '25_Scared.png' },
  { id: 26, name: 'Shocked', file: '26_Shocked.png' },
  { id: 27, name: 'Proud', file: '27_Proud.png' },
  { id: 28, name: 'Disappointed', file: '28_Disappointed.png' },
  { id: 29, name: 'Guilty', file: '29_Guilty.png' },
  { id: 30, name: 'Peaceful', file: '30_Peaceful.png' },
  { id: 31, name: 'Love', file: '31_Love.png' },
  { id: 32, name: 'Heartbroken', file: '32_Heartbroken.png' },
  { id: 33, name: 'Inspired', file: '33_Inspired.png' },
  { id: 34, name: 'Productive', file: '34_Productive.png' },
  { id: 35, name: 'Lazy', file: '35_Lazy.png' },
  { id: 36, name: 'Sick', file: '36_Sick.png' },
  { id: 37, name: 'Disgusted', file: '37_Disgusted.png' },
  { id: 38, name: 'Sleepy', file: '38_Sleepy.png' },
  { id: 39, name: 'Restless', file: '39_Restless.png' },
  { id: 40, name: 'Neutral', file: '40_Neutral.png' }
];

export const getMoodById = (id) => {
  return moods.find(m => m.id === id) || null;
};

export const getAllMoods = () => moods;

export default moods;
