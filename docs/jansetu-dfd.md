# JanSetu DFD Flow

The proposed civic grievance data flow is:

```text
Citizen
    -> JanSetu
    -> Priority / Classification
    -> Department
    -> Government System
    -> Officer
    -> Resolution
    -> Citizen Verification
```

The **Government System** is a proposed integration boundary. No specific government API or live synchronization is claimed until an official interface is confirmed.

## Data Moving Through the Flow

- **Citizen -> JanSetu:** complaint description, category, location, severity, and evidence.
- **JanSetu -> Priority / Classification:** validated complaint information for categorization and prioritization.
- **Priority / Classification -> Department:** category, priority, safety indicators, and related-issue context.
- **Department -> Government System:** routed complaint and department reference, if integration is enabled.
- **Government System -> Officer:** assigned government work item, if integration is enabled.
- **Officer -> JanSetu:** progress, resolution details, and resolution evidence.
- **JanSetu -> Citizen:** complaint ID, status, progress, and resolution information.
- **Citizen -> JanSetu:** resolution verification, rating, or reopen request.

This document describes the intended DFD flow only; it does not add or claim backend functionality.
