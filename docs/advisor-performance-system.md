# Oshurn Advisor Performance & Escalation System

## Purpose

Provide a consistent, transparent workflow for advisor accountability while preserving a human review step before any contract decision.

This is an operational design specification, not legal, tax, employment, or compliance advice. Contractor classification, agreements, compensation, termination, licensing, and state-specific requirements must be reviewed by qualified counsel/CPA/compliance professionals.

## Core states

- GREEN — on track
- YELLOW — attention required
- RED — management review required
- REMEDIATION — documented improvement period
- CLOSED — resolved or contract decision completed by authorized management

## Advisor profile

Each advisor record should support:

- legal/business name
- contact channels owned by Oshurn
- state(s) and license type(s)
- license verification status and expiration dates
- carrier/BGA relationships
- onboarding status
- training status
- work schedule/availability
- performance state
- open issues/cases
- assigned lead count
- overdue task count

## Workday workflow

1. Advisor authenticates to Oshurn.
2. Dashboard shows today's tasks, leads, appointments, applications, underwriting follow-ups, and required training.
3. Advisor completes work and records required activity in CRM.
4. System calculates task health from documented due dates, required actions, and configured service-level targets.
5. System sends reminders before escalation.

## Escalation logic

### Green

No escalation. Continue normal work.

### Yellow

Triggered by configured, role-appropriate conditions such as overdue tasks, incomplete required training, missing CRM updates, or approaching service deadlines.

System actions:

- show yellow status on advisor dashboard
- send automated Oshurn email notification
- optionally send SMS through an approved business messaging provider
- provide a single-click review page
- allow advisor to select an issue reason and submit an explanation

### Red

Triggered only after configured yellow conditions remain unresolved or a defined serious workflow condition occurs.

System actions:

- show red status
- create a management review case
- notify authorized management
- send the advisor a professional notice
- require the advisor to acknowledge and provide an explanation where appropriate
- preserve an audit trail

### Issue categories

- Technical problem
- Training/support needed
- Client issue
- Scheduling issue
- Lead quality issue
- Licensing/compliance issue
- Personal/emergency circumstance
- Other

The advisor may provide a short explanation and request assistance. Sensitive information should not be requested unnecessarily through SMS or email.

## Remediation

A red status must not automatically terminate a contractor relationship.

Authorized management may create a documented remediation plan containing:

- issue summary
- objective expectations
- required actions
- support/resources offered
- review period
- review date
- outcome

Possible outcomes:

- return to GREEN
- continue YELLOW with support
- extend remediation
- management determines whether a contractual action is appropriate under the governing agreement and applicable law

## CEO dashboard

The executive dashboard should summarize:

- advisors by state
- green/yellow/red counts
- open management reviews
- overdue tasks
- lead response performance
- appointments
- applications
- underwriting follow-ups
- licensing/compliance exceptions
- remediation cases
- trend over time

The CEO should not need to personally text individual advisors for routine workflow issues. Communications should originate from Oshurn's approved business channels and be logged in the CRM.

## Automation events

Example event sequence:

`TASK_CREATED`
→ `TASK_APPROACHING_DUE`
→ `TASK_OVERDUE`
→ `YELLOW_TRIGGERED`
→ `ADVISOR_NOTIFIED`
→ `ADVISOR_RESPONSE_SUBMITTED`
→ `MANAGEMENT_REVIEW_CREATED`
→ `REMEDIATION_STARTED`
→ `REMEDIATION_REVIEWED`
→ `STATUS_RESOLVED`

Every event should have a timestamp, actor/system source, related advisor/task, and minimal necessary metadata.

## Guardrails

- Do not automatically terminate based solely on a score.
- Do not infer misconduct from a missed task.
- Provide a response/explanation mechanism.
- Keep a human-authorized review step.
- Use consistent rules across similarly situated advisors.
- Keep sensitive personal information out of routine notifications.
- Limit access by role.
- Preserve an audit trail.
- Make state-specific and contractual rules configurable rather than hard-coded.
- Do not allow unlicensed individuals to perform activities requiring an insurance license.

## Future implementation

Recommended database entities:

- `advisor_performance_status`
- `advisor_performance_rules`
- `advisor_issue_cases`
- `advisor_remediation_plans`
- `advisor_notifications`
- `advisor_status_events`

Recommended UI modules:

- Advisor Work Queue
- My Performance
- Issue/Support Request
- Management Review Queue
- CEO Workforce Dashboard
- State/License Compliance Dashboard
