// lib/insights.ts
import { HabitId, WeekHistory, Targets } from './storage'
import { getHabitScores } from './scoring'

/* ─── Types ──────────────────────────────────────────────────────────── */
export type InsightSeverity = 'critical' | 'low' | 'medium'

export interface WeeklyInsight {
  habitId: HabitId
  title: string
  body: string
  severity: InsightSeverity
}

/* ─── Score-tiered advice per habit ─────────────────────────────────── */
// Each habit has 3 tiers based on weekly completion ratio:
//   critical  →  < 30%   ("You're barely doing this — immediate action needed.")
//   low       →  30–59%  ("You're inconsistent — small upgrades go a long way.")
//   medium    →  60–79%  ("You're close — one habit shift will push you over.")
const TIERED_ADVICE: Record<
  HabitId,
  Record<InsightSeverity, { title: string; body: string }>
> = {
  hydration: {
    critical: {
      title: 'Critical: Start Drinking Water',
      body: "You're logging almost no water this week. Chronic dehydration impairs focus, energy, and metabolism immediately — before you even feel thirsty. Begin with just one glass before each meal and one when you wake up. That alone adds 4 glasses daily with zero effort.",
    },
    low: {
      title: 'Hydration Needs Work',
      body: "You're hitting your water goal on fewer than half your days. Carry a visible water bottle — out of sight is out of mind. Pairing a sip of water with existing habits (morning coffee, after bathroom trips) makes it automatic without relying on willpower.",
    },
    medium: {
      title: 'Almost There with Hydration',
      body: "You're consistently close but not quite hitting your daily water target. Try starting your day with 500ml before breakfast — studies show morning hydration sets a better baseline for the rest of the day and reduces the chance of an afternoon slump.",
    },
  },
  sleep: {
    critical: {
      title: 'Critical: Sleep Deprivation Risk',
      body: "Your sleep logs show a severe deficit this week. Below 6 hours nightly, your cognitive performance is equivalent to not sleeping at all for 24 hours — but you don't feel it because impairment accumulates gradually. Prioritizing even one extra hour tonight has measurable benefits.",
    },
    low: {
      title: 'Sleep Is Inconsistent',
      body: "You're hitting your sleep target only sporadically this week. Irregular sleep schedules disrupt your circadian rhythm just as much as short sleep. Set a fixed wake-up time every day — even weekends — and your body will naturally start falling asleep at the right time.",
    },
    medium: {
      title: 'Refine Your Sleep Quality',
      body: "You're getting enough hours most nights, but quality matters too. Dim all screens 45 minutes before bed, and keep your room cool. Small environment tweaks consistently outperform sleep supplements and apps for long-term rest quality.",
    },
  },
  activity: {
    critical: {
      title: 'Critical: Almost No Movement',
      body: "You've logged very little physical activity this week. Even 10 minutes of brisk walking triggers the same cardiovascular adaptations as longer sessions. Replace one sedentary habit this week — a meeting walk, a standing desk session, or 5 minutes of stairs — and build from there.",
    },
    low: {
      title: 'Activity Is Sporadic',
      body: "You're moving on some days but skipping more than half. Research shows the biggest fitness gains come from consistency, not intensity. Three 10-minute micro-sessions of movement spread through your day have nearly the same metabolic effect as one 30-minute workout.",
    },
    medium: {
      title: 'Boost Your Activity Streak',
      body: "You're close to your activity goal most days. The key now is protecting your streak — schedule your activity at the same time each day. Morning exercisers have a 90%+ adherence rate because willpower hasn't been depleted yet.",
    },
  },
  meals: {
    critical: {
      title: 'Critical: Irregular Eating Pattern',
      body: "You're logging very few meals this week. Skipping meals chronically spikes cortisol, destabilizes blood sugar, and dramatically increases cravings for high-calorie foods later. Even simple defaults — fruit, nuts, a boiled egg — count as a meal log and keep your metabolism stable.",
    },
    low: {
      title: 'Meal Consistency Needs Attention',
      body: "You're eating regularly on fewer than half your days. Meal skipping leads to compensatory overeating. Prep just one simple, portable meal option for the next 3 days — something you can grab without thinking. Reducing friction is more effective than building motivation.",
    },
    medium: {
      title: 'Fine-Tune Meal Timing',
      body: "Your meal frequency is good, but timing can be optimized further. Front-loading calories earlier in the day — eating your largest meal before 2pm — aligns with your body's peak insulin sensitivity and energy needs, leaving lighter eating for the evening.",
    },
  },
  screenbreak: {
    critical: {
      title: 'Critical: Eye Strain Overload',
      body: "You're taking almost no screen breaks this week. Continuous screen use reduces your blink rate by up to 66%, causing dry eye syndrome and digital fatigue that compounds throughout the day. Set a simple timer for every 20 minutes — even just 20 seconds of looking away makes a measurable difference.",
    },
    low: {
      title: 'Screen Breaks Are Inconsistent',
      body: "You're taking breaks on some days but skipping them on others. Mental fatigue from sustained screen focus accumulates invisibly. Use a visual cue — a sticky note, a phone alarm, or a browser extension — to trigger breaks automatically so you don't rely on remembering.",
    },
    medium: {
      title: 'Make Screen Breaks Habitual',
      body: "You're close to your screen break target most days. Now make it structural, not discretionary: stand up, look out a window, and take 3 slow breaths during each break. This adds a micro-stress-reset that multiplies the benefit beyond just eye rest.",
    },
  },
  stressrelief: {
    critical: {
      title: 'Critical: No Stress Relief Logged',
      body: "You haven't logged any stress relief activity this week. Unmanaged chronic stress elevates cortisol continuously, impairing immunity, sleep quality, and decision-making. Even 5 minutes of box breathing (4s inhale, 4s hold, 4s exhale, 4s hold) measurably resets your nervous system — no equipment needed.",
    },
    low: {
      title: 'Stress Relief Is Inconsistent',
      body: "You're managing stress only on some days. The benefit of stress-relief practices is cumulative, not one-time — daily short sessions outperform occasional long ones. Attach a 5-minute breathing or mindfulness session to an existing anchor like your morning coffee or lunchtime.",
    },
    medium: {
      title: 'Deepen Your Stress Practice',
      body: "You're logging stress relief most days — that's excellent. To deepen the effect, try extending one session per week to 15 minutes. Research shows that longer sessions once a week train the parasympathetic nervous system more durably than only brief daily practices.",
    },
  },
}

/* ─── Get severity tier from ratio ──────────────────────────────────── */
function getSeverity(ratio: number): InsightSeverity {
  if (ratio < 0.3) return 'critical'
  if (ratio < 0.7) return 'low'
  return 'medium'
}

/* ─── Public API ─────────────────────────────────────────────────────── */

/**
 * Returns 2–3 personalized insights based on the user's actual weekly
 * completion ratios for each habit. The two habits with the lowest ratio
 * are always included; if all habits are doing well, still returns the
 * 2 that need the most attention.
 */
export function generateWeeklyInsights(
  history: WeekHistory,
  targets: Targets
): WeeklyInsight[] {
  if (history.length === 0) {
    // Cold start — return two helpful defaults
    return [
      { habitId: 'hydration', ...TIERED_ADVICE.hydration.critical, severity: 'critical' },
      { habitId: 'activity',  ...TIERED_ADVICE.activity.critical,  severity: 'critical' },
    ]
  }

  // Aggregate each habit's average weekly ratio
  const habitRatios = history.reduce<Record<HabitId, number[]>>(
    (acc, day) => {
      for (const [id, val] of Object.entries(day.completions) as [HabitId, number][]) {
        const target = targets[id]
        if (!target) continue
        const ratio = Math.min(val / target, 1)
        if (!acc[id]) acc[id] = []
        acc[id].push(ratio)
      }
      return acc
    },
    {} as Record<HabitId, number[]>
  )

  // Calculate average ratio per habit; habits with no data treated as 0
  const avgRatios: { id: HabitId; ratio: number }[] = [
    'hydration', 'sleep', 'activity', 'meals', 'screenbreak', 'stressrelief',
  ].map((id) => {
    const vals = habitRatios[id as HabitId]
    const ratio = vals && vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0
    return { id: id as HabitId, ratio }
  })

  // Sort by worst first
  avgRatios.sort((a, b) => a.ratio - b.ratio)

  // Take bottom 2 (or 3 if third is still critical/low)
  const chosen = avgRatios.slice(0, 2)
  if (avgRatios[2]?.ratio < 0.3) chosen.push(avgRatios[2]) // add third if it's critical

  return chosen.map(({ id, ratio }) => {
    const severity = getSeverity(ratio)
    const advice = TIERED_ADVICE[id][severity]
    return { habitId: id, ...advice, severity }
  })
}
