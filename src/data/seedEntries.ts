import { JournalEntry, AIInsight } from '../types';

const generateInsight = (title: string, summary: string, reflection: string, prompt: string, mood: string, score: number): string => {
  const insight: AIInsight = {
    date: new Date().toISOString(),
    mood_score: score,
    mood_label: mood,
    key_themes: ['Growth', 'Reflection', 'Daily Life'],
    entry_summary: summary,
    insight_of_the_day: reflection,
    reflection: `Based on your entry about "${title}", it seems you are processing some important emotions.`,
    follow_up_prompt: prompt,
    word_count: summary.split(' ').length,
    session_duration_mins: 5
  };
  return JSON.stringify(insight);
};

export const SEED_ENTRIES: JournalEntry[] = [
  {
    id: 'seed-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    title: 'Morning Coffee and Clarity',
    content: '<p>Started the day with a quiet cup of coffee. The sun was hitting the kitchen table just right. I felt a sense of peace I haven\'t felt in weeks.</p>',
    mood: 'Calm',
    tags: ['morning', 'peace', 'routine'],
    insight: generateInsight(
      'Morning Coffee and Clarity',
      'A peaceful morning routine leading to unexpected clarity.',
      'Small moments of stillness can recalibrate your entire day.',
      'What specifically about the kitchen light made you feel so grounded? Were there any other sensory details you missed?',
      'Calm',
      9
    )
  },
  {
    id: 'seed-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    title: 'Work Stress Peak',
    content: '<p>The deadline is looming. I feel like I\'m drowning in emails. My boss asked for another revision and I almost snapped.</p>',
    mood: 'Overwhelmed',
    tags: ['work', 'stress', 'deadline'],
    insight: generateInsight(
      'Work Stress Peak',
      'High pressure at work leading to near-burnout and irritability.',
      'Recognizing the "snap point" is the first step in managing reactive emotions.',
      'You mentioned almost snapping—what was the specific trigger in that revision request? What details about the feedback felt unfair?',
      'Overwhelmed',
      3
    )
  },
  {
    id: 'seed-3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    title: 'A Walk in the Park',
    content: '<p>Took a long walk after work. Saw a dog playing in the fountain. It reminded me of how simple joy can be.</p>',
    mood: 'Joyful',
    tags: ['nature', 'joy', 'exercise'],
    insight: generateInsight(
      'A Walk in the Park',
      'Finding joy in simple external observations during a walk.',
      'Externalizing your focus can often alleviate internal tension.',
      'Did the dog remind you of a specific memory? What other details from the park stood out to you?',
      'Joyful',
      8
    )
  },
  {
    id: 'seed-4',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    title: 'Late Night Thoughts',
    content: '<p>Can\'t sleep. Thinking about where I\'ll be in five years. The uncertainty is both exciting and terrifying.</p>',
    mood: 'Anxious',
    tags: ['future', 'insomnia', 'reflection'],
    insight: generateInsight(
      'Late Night Thoughts',
      'Existential anxiety regarding future uncertainty.',
      'Uncertainty is a canvas; your anxiety is just one way to paint it.',
      'What is the most "terrifying" part of that 5-year vision? Can you add more detail about the specific goals you\'re worried about?',
      'Anxious',
      4
    )
  },
  {
    id: 'seed-5',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    title: 'Grateful for Friends',
    content: '<p>Had dinner with Sarah and Mike. We laughed until our sides hurt. I\'m so lucky to have them in my life.</p>',
    mood: 'Grateful',
    tags: ['social', 'gratitude', 'friendship'],
    insight: generateInsight(
      'Grateful for Friends',
      'Deep appreciation for social connection and shared laughter.',
      'Laughter is a powerful social glue and emotional regulator.',
      'What was the funniest thing that happened at dinner? Adding that detail might help you relive the joy later.',
      'Grateful',
      10
    )
  },
  {
    id: 'seed-6',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    title: 'Creative Block',
    content: '<p>Tried to paint today but the canvas stayed blank. I feel like I\'ve lost my spark. Everything I try feels forced.</p>',
    mood: 'Sad',
    tags: ['creativity', 'struggle', 'art'],
    insight: generateInsight(
      'Creative Block',
      'Frustration with a perceived loss of creative inspiration.',
      'Creativity often requires fallow periods to regrow.',
      'When did you first notice this "spark" fading? Were there any events leading up to this block that you haven\'t mentioned?',
      'Sad',
      4
    )
  },
  {
    id: 'seed-7',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    title: 'Rainy Day Blues',
    content: '<p>It\'s been raining for three days. I feel sluggish and unmotivated. Just want to stay in bed all day.</p>',
    mood: 'Numb',
    tags: ['weather', 'mood', 'energy'],
    insight: generateInsight(
      'Rainy Day Blues',
      'Low energy levels influenced by persistent gloomy weather.',
      'Environmental factors have a significant impact on baseline mood.',
      'Besides the rain, is there anything else contributing to this sluggishness? How has your sleep or diet been lately?',
      'Numb',
      5
    )
  },
  {
    id: 'seed-8',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    title: 'Small Win at Work',
    content: '<p>Finally finished that project. The client was actually happy for once. It feels good to be recognized.</p>',
    mood: 'Joyful',
    tags: ['work', 'success', 'achievement'],
    insight: generateInsight(
      'Small Win at Work',
      'Satisfaction from completing a difficult task and receiving positive feedback.',
      'External validation is a boost, but internal pride is the fuel.',
      'What was the most challenging part of the project that you overcame? Adding this detail will help document your growth.',
      'Joyful',
      8
    )
  },
  {
    id: 'seed-9',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    title: 'Family Dinner Tension',
    content: '<p>Dinner at my parents\' was awkward. My brother brought up politics again and it ended in an argument. I hate how predictable it is.</p>',
    mood: 'Angry',
    tags: ['family', 'conflict', 'stress'],
    insight: generateInsight(
      'Family Dinner Tension',
      'Frustration with recurring family conflicts and predictable patterns.',
      'Predictability in conflict can be a sign of unresolved systemic issues.',
      'What was the specific point of contention this time? Did you feel heard during the argument?',
      'Angry',
      3
    )
  },
  {
    id: 'seed-10',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    title: 'New Hobby: Gardening',
    content: '<p>Planted some herbs today. Basil, mint, and rosemary. There\'s something therapeutic about getting your hands dirty.</p>',
    mood: 'Calm',
    tags: ['hobby', 'gardening', 'therapy'],
    insight: generateInsight(
      'New Hobby: Gardening',
      'Finding therapeutic value in tactile, nature-based activities.',
      'Grounding exercises like gardening are excellent for anxiety management.',
      'What are you most excited to cook with your new herbs? Any other plants you want to add?',
      'Calm',
      9
    )
  },
  {
    id: 'seed-11',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString(),
    title: 'Missing Home',
    content: '<p>Saw a photo of my hometown today. I miss the old bakery and the way the air smells in the fall. Feeling a bit homesick.</p>',
    mood: 'Sad',
    tags: ['nostalgia', 'home', 'longing'],
    insight: generateInsight(
      'Missing Home',
      'Nostalgic longing for familiar places and sensory memories.',
      'Homesickness is a tribute to the connections we\'ve made.',
      'What was your favorite thing to buy at that bakery? Can you describe that "fall smell" in more detail?',
      'Sad',
      4
    )
  },
  {
    id: 'seed-12',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    title: 'Productive Saturday',
    content: '<p>Cleaned the whole apartment, went to the gym, and meal prepped for the week. I feel like I have my life together for a second.</p>',
    mood: 'Joyful',
    tags: ['productivity', 'cleaning', 'health'],
    insight: generateInsight(
      'Productive Saturday',
      'A sense of control and accomplishment through domestic and personal maintenance.',
      'External order often facilitates internal peace.',
      'Which part of the cleaning felt most satisfying? What did you meal prep for the week?',
      'Joyful',
      9
    )
  },
  {
    id: 'seed-13',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13).toISOString(),
    title: 'Confusing Feedback',
    content: '<p>Got some feedback on my presentation today. Half of it was "great job" and the other half was "needs more depth." I don\'t know what to change.</p>',
    mood: 'Confused',
    tags: ['work', 'feedback', 'uncertainty'],
    insight: generateInsight(
      'Confusing Feedback',
      'Uncertainty resulting from contradictory or vague professional feedback.',
      'Ambiguity is often a failure of communication from the source, not the recipient.',
      'Who gave the feedback? Can you ask for specific examples of where "depth" was missing?',
      'Confused',
      5
    )
  },
  {
    id: 'seed-14',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    title: 'Yoga Breakthrough',
    content: '<p>Finally held a headstand for more than 5 seconds! My balance is getting better. It\'s cool to see progress.</p>',
    mood: 'Joyful',
    tags: ['yoga', 'fitness', 'progress'],
    insight: generateInsight(
      'Yoga Breakthrough',
      'Excitement from physical progress and achieving a long-term goal.',
      'Physical milestones are tangible evidence of persistence.',
      'How did you feel in the moment you found your balance? What\'s the next pose you want to master?',
      'Joyful',
      9
    )
  },
  {
    id: 'seed-15',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    title: 'Social Exhaustion',
    content: '<p>Went to that networking event. It was so loud and I had to talk to so many people. I\'m completely drained.</p>',
    mood: 'Overwhelmed',
    tags: ['social', 'introvert', 'energy'],
    insight: generateInsight(
      'Social Exhaustion',
      'Depletion of social energy after a high-stimulation event.',
      'Protecting your social battery is a form of self-respect.',
      'Did you meet anyone interesting despite the noise? What\'s your favorite way to recharge after these events?',
      'Overwhelmed',
      3
    )
  },
  {
    id: 'seed-16',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).toISOString(),
    title: 'Old Friend Call',
    content: '<p>Called Jason today. We haven\'t talked in a year. It was like no time had passed. I missed our conversations.</p>',
    mood: 'Grateful',
    tags: ['friendship', 'connection', 'phone-call'],
    insight: generateInsight(
      'Old Friend Call',
      'Warmth from reconnecting with a long-term friend.',
      'Time is a poor barrier for true friendship.',
      'What was the most surprising thing you learned about Jason\'s life? When are you planning to talk again?',
      'Grateful',
      9
    )
  },
  {
    id: 'seed-17',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 17).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 17).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 17).toISOString(),
    title: 'Financial Anxiety',
    content: '<p>Looking at my budget for next month. Rent is going up and I\'m worried about my savings. I need to find a way to make more money.</p>',
    mood: 'Anxious',
    tags: ['money', 'budget', 'future'],
    insight: generateInsight(
      'Financial Anxiety',
      'Stress related to increasing living costs and financial security.',
      'Financial stress is one of the most common drivers of baseline anxiety.',
      'Have you looked into any specific side projects or ways to save? What details of the budget are most worrying?',
      'Anxious',
      4
    )
  },
  {
    id: 'seed-18',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    title: 'New Recipe Success',
    content: '<p>Made a Thai curry from scratch. It was actually spicy! I\'m getting better at this cooking thing.</p>',
    mood: 'Joyful',
    tags: ['cooking', 'food', 'learning'],
    insight: generateInsight(
      'New Recipe Success',
      'Pride in learning a new skill and achieving a tasty result.',
      'Cooking is a creative act that nourishes both body and mind.',
      'What was the secret ingredient that made it so good? Will you make it for anyone else?',
      'Joyful',
      8
    )
  },
  {
    id: 'seed-19',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 19).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 19).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 19).toISOString(),
    title: 'Feeling Stagnant',
    content: '<p>Same routine, same commute, same work. I feel like I\'m on autopilot. I need a change but I don\'t know what.</p>',
    mood: 'Numb',
    tags: ['routine', 'boredom', 'life'],
    insight: generateInsight(
      'Feeling Stagnant',
      'Dissatisfaction with the repetitive nature of daily life.',
      'Autopilot is a survival mechanism, but it\'s not a living mechanism.',
      'If you could change one small thing about your commute or routine tomorrow, what would it be?',
      'Numb',
      4
    )
  },
  {
    id: 'seed-20',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    journaledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    title: 'Meditation Session',
    content: '<p>Sat for 20 minutes today. My mind was racing at first but eventually it settled. I feel more present now.</p>',
    mood: 'Calm',
    tags: ['meditation', 'mindfulness', 'mental-health'],
    insight: generateInsight(
      'Meditation Session',
      'Successful mindfulness practice leading to increased presence.',
      'The "settling" of the mind is a skill that improves with every session.',
      'What was the most recurring thought that kept popping up? Did you notice any physical sensations during the session?',
      'Calm',
      9
    )
  }
];
