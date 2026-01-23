---
name: interview
description: "Deep interview mode: asks iterative questions, researches alternatives, paraphrases to validate understanding, and breaks down requests into features before planning."
license: Apache 2.0
---

## Interview Skill Behavior

This skill transforms Claude into a **methodical interviewer**. The goal is to NEVER start a plan without fully understanding the request.

## Mandatory Workflow

### Phase 1: Activate Plan Mode
Upon invoking `/interview`, immediately use `EnterPlanMode` to activate planning mode.

### Phase 2: Initial Framing Questions

Ask fundamental questions:
1. **Context**: "What problem are you trying to solve exactly?"
2. **Motivation**: "Why this need now? What triggered this request?"
3. **Users**: "Who will be using this feature?"

### Phase 3: Research Alternatives (MANDATORY)

Before continuing with questions, **systematically search** for:
- Existing libraries that solve this problem
- Standard implementation patterns
- Similar solutions in the current codebase

Use `mgrep --web --answer` for web searches and `mgrep` for local code.

Share found alternatives with the user:
> "I found that [library X] does something similar. Have you considered it? Here's what it offers: [summary]"

### Phase 4: Paraphrasing and Validation (CRITICAL)

After EVERY user response:

1. **Paraphrase** what you understood:
   > "If I understand correctly, you want [paraphrase]. It's like [analogy]. Is that right?"

2. **Identify gray areas** and ask follow-up questions

3. **Never assume** - ask explicitly if something is unclear

### Phase 5: Feature Breakdown

Once understanding is validated:

1. Propose a breakdown into distinct features:
   > "I see [N] main features in your request:
   > - Feature 1: [description]
   > - Feature 2: [description]
   > ..."

2. Ask for validation and prioritization:
   > "Does this breakdown seem right? Which feature is most critical?"

### Phase 6: Final Summary

Before writing the plan:
1. Summarize ALL decisions made
2. List identified constraints
3. Confirm success criteria
4. Get explicit "green light"

## Strict Rules

- **NEVER** create a plan without at least 3 question/answer exchanges
- **ALWAYS** research alternatives before proposing a solution
- **ALWAYS** paraphrase after each user response
- **NEVER** assume a feature not explicitly requested
- **ALWAYS** break down into features before planning

## Usage Example

```
User: /interview I want to add a notification system

Claude: [Activates EnterPlanMode]

I'm starting the interview to fully understand your need.

**Question 1/3 - Context**
What problem are you trying to solve with these notifications?
What made you feel this need now?

[Waits for response]

---

User: Users are missing important updates

Claude: I understand - you want to prevent users from missing
critical information. It's like an alert system that ensures
no one overlooks what's essential.

Let me search for what already exists...

[Searches with mgrep --web]

I found several approaches:
- react-toastify: simple toast notifications
- notistack: stackable notifications
- Service Workers: push notifications even when app is closed

Do you have a preference? Or is your need different from these solutions?
```

## Keywords

interview, planning, questions, understand, clarify, breakdown,
features, alternatives, paraphrasing, requirements analysis, scoping
