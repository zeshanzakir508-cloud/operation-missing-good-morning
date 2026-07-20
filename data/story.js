/**
 * ==========================================================
 * Operation Missing Good Morning
 * Story Data
 * Version: 1.0.0
 * ==========================================================
 */

"use strict";

const STORY = [

/* ==========================================================
   SCENE 1
========================================================== */

{
    id: 1,

    icon: "🕵️",

    title: "Confidential Investigation",

    message:
`Welcome to the Family Investigation Bureau.

A confidential investigation has been initiated.

All evidence collected today will be analyzed.

Please remain calm.

Do not close this investigation.`,

    status: "INITIALIZING",

    progress: 5,

    type: "info",

    button: "Begin Investigation",

    logs: [

        "Connecting to Investigation Server...",

        "Authenticating investigator...",

        "Loading today's timeline...",

        "Access granted."

    ]
},

/* ==========================================================
   SCENE 2
========================================================== */

{
    id: 2,

    icon: "📡",

    title: "Scanning Today's Activities",

    message:
`Artificial Intelligence is examining today's activities.

Searching conversations...

Checking memory...

Reviewing communication timeline...

Please wait...`,

    status: "SCANNING",

    progress: 12,

    type: "warning",

    button: "Continue",

    logs: [

        "Opening WhatsApp records...",

        "Searching greetings...",

        "Checking message timestamps...",

        "Comparing daily routine..."

    ]
},

/* ==========================================================
   SCENE 3
========================================================== */

{
    id: 3,

    icon: "🚨",

    title: "Incident Confirmed",

    message:
`Alert!

Today's Good Morning message could not be found.

This unusual event has triggered an automatic family investigation.`,

    status: "ALERT",

    progress: 20,

    type: "danger",

    button: "View Evidence",

    logs: [

        "Good Morning status: Missing",

        "No greeting detected.",

        "Evidence recorded.",

        "Investigation escalated."

    ]
},

/* ==========================================================
   SCENE 4
========================================================== */

{
    id: 4,

    icon: "🧾",

    title: "Evidence Collection",

    message:
`Collecting all available evidence.

✔ WhatsApp checked

✔ Memory checked

✔ Morning routine checked

✔ Call history checked

Evidence collection completed.`,

    status: "COLLECTING",

    progress: 32,

    type: "warning",

    button: "Identify Suspect",

    logs: [

        "Memory Scan: Complete",

        "Conversation Scan: Complete",

        "Timeline Ready",

        "Preparing suspect list..."

    ]
},

/* ==========================================================
   SCENE 5
========================================================== */

{
    id: 5,

    icon: "🎯",

    title: "Primary Suspect Identified",

    message:
`After careful analysis...

Only ONE suspect matches every piece of evidence.

Name:

HUSBAND

Confidence Level:

99.98%`,

    status: "SUSPECT FOUND",

    progress: 45,

    type: "danger",

    button: "Interrogate",

    logs: [

        "Running identity verification...",

        "Matching behavioral patterns...",

        "Suspect confirmed.",

        "Preparing interrogation..."

    ]
},

/* ==========================================================
   SCENE 6
========================================================== */

{
    id: 6,

    icon: "🎤",

    title: "Interrogation Room",

    message:
`Question:

Did you forget to send Good Morning today?

...

Suspect is thinking...

...

Final Answer:

Yes...

I forgot.`,

    status: "CONFESSION",

    progress: 58,

    type: "warning",

    button: "Analyze Motive",

    logs: [

        "Voice analysis completed.",

        "Stress level: Medium",

        "Lie detector: Negative",

        "Confession accepted."

    ]
},
/* ==========================================================
   SCENE 7
========================================================== */

{
    id: 7,

    icon: "🧠",

    title: "Motive Analysis",

    message:
`Further investigation revealed something unexpected.

The husband did NOT intentionally ignore his wife.

He became busy with daily responsibilities.

However...

His thoughts kept returning to only one person.`,

    status: "ANALYZING",

    progress: 66,

    type: "info",

    button: "Reveal Findings",

    logs: [

        "Analyzing emotional patterns...",

        "Checking memory fragments...",

        "No malicious intent detected.",

        "Investigation continuing."

    ]
},

/* ==========================================================
   SCENE 8
========================================================== */

{
    id: 8,

    icon: "❤️",

    title: "Hidden Truth",

    message:
`Although the message was forgotten...

The person was never forgotten.

Evidence indicates that thoughts about his wife appeared repeatedly throughout the day.

Conclusion:

The heart remembered...
even when the phone didn't.`,

    status: "TRUTH FOUND",

    progress: 74,

    type: "success",

    button: "Court Hearing",

    logs: [

        "Memory scan complete.",

        "Affection detected.",

        "Ignoring wife: False",

        "Forgetting message: True"

    ]
},

/* ==========================================================
   SCENE 9
========================================================== */

{
    id: 9,

    icon: "⚖️",

    title: "Family Court",

    message:
`The Family Court has reviewed all evidence.

Charge:

Forgetting today's Good Morning message.

Verdict:

Guilty...

but with honorable intentions.`,

    status: "VERDICT",

    progress: 82,

    type: "warning",

    button: "Read Sentence",

    logs: [

        "Judge entered courtroom.",

        "Evidence accepted.",

        "Sentence prepared.",

        "Court adjourned."

    ]
},

/* ==========================================================
   SCENE 10
========================================================== */

{
    id: 10,

    icon: "🌞",

    title: "Official Court Order",

    message:
`The court orders the husband to immediately deliver the delayed greeting.

🌸 Good Morning! 🌸

May your day be filled with happiness, smiles, peace, good health, and countless blessings.

Better late than never.`,

    status: "ORDER ISSUED",

    progress: 90,

    type: "success",

    button: "Final Report",

    logs: [

        "Court order issued.",

        "Greeting approved.",

        "Delivery successful.",

        "Monitoring wife's reaction..."

    ]
},

/* ==========================================================
   SCENE 11
========================================================== */

{
    id: 11,

    icon: "😊",

    title: "Case Status",

    message:
`Investigation Summary

✔ Good Morning message forgotten.

✔ Wife never forgotten.

✔ Husband admitted the mistake.

✔ Late greeting delivered successfully.

Pending Item:

Waiting for wife's beautiful smile...`,

    status: "PENDING",

    progress: 97,

    type: "info",

    button: "Close Case",

    logs: [

        "Case almost complete.",

        "Smile detector initializing...",

        "Positive response expected.",

        "Finalizing report..."

    ]
},

/* ==========================================================
   SCENE 12
========================================================== */

{
    id: 12,

    icon: "🎉",

    title: "Case Closed",

    message:
`Congratulations!

Operation Missing Good Morning has officially ended.

The Investigation Bureau recommends one final action...

Please forgive your forgetful husband.

Case Closed.

Thank you for your cooperation. ❤️`,

    status: "CLOSED",

    progress: 100,

    type: "success",

    button: "Restart",

    logs: [

        "Smile detected.",

        "Case archived.",

        "Investigation completed.",

        "Good Morning restored."

    ]
}

];

Object.freeze(STORY);
