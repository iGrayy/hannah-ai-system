# Hannah AI - Component Structure Guide

## 📁 Structure

```
components/
├── admin/                    # Admin functionality
│   ├── user-management/      # User accounts & permissions
│   ├── system-configuration/ # Settings & integrations  
│   ├── performance-monitoring/ # System metrics
│   └── [future modules]/
├── faculty/                  # Faculty functionality
│   ├── response-review/      # Review & approve responses
│   ├── custom-responses/     # Custom FAQ management
│   ├── quality-monitoring/   # Conversation quality
│   ├── knowledge-management/ # Content creation
│   ├── analytics/           # Student insights
│   └── [future modules]/
├── shared/                   # Shared components
│   ├── common/              # Common business components
│   ├── layout/              # Layout components
│   └── debug/               # Debug/test components
└── ui/                      # Base UI components
```

## 🎯 Usage

```typescript
// Import by functionality
import { UserAccounts } from "@/components/admin/user-management"
import { ResponseQueue } from "@/components/faculty/response-review"
import { ContentEditor } from "@/components/faculty/knowledge-management"
```

## 📋 Rule

**When adding new UI:** Place in appropriate functionality folder based on business purpose, not technical implementation.
