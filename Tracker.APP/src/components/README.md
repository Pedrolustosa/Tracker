# Estrutura de Componentes - Solar Tracker Dashboard

Esta pasta contém todos os componentes React organizados por funcionalidade para facilitar a manutenção e localização.

## 📁 Estrutura de Pastas

### `/dashboard` - Componentes do Dashboard Principal
- **TrackerChart.tsx** - Componente principal que orquestra todo o dashboard
- **KPISection.tsx** - Seção de KPIs (Produção, Eficiência, Radiação, Economia)
- **SystemInfoLine.tsx** - Linha de informações técnicas do sistema
- **index.ts** - Exports centralizados dos componentes do dashboard

### `/forms` - Componentes de Formulários
- **TrackerForm.tsx** - Formulário principal de configuração do tracker
- **fields/** - Campos específicos do formulário
  - **LocationFields.tsx** - Campos de localização (latitude, longitude)
  - **PeriodFields.tsx** - Campos de período (data início/fim)
  - **EnvironmentFields.tsx** - Campos ambientais (temperatura, radiação)
  - **TrackerFields.tsx** - Campos específicos do tracker (tilt, azimuth)
- **index.ts** - Exports centralizados dos componentes de formulário

### `/charts` - Componentes de Gráficos
- **DashboardChart.tsx** - Componente de gráfico principal usando Chart.js
- **index.ts** - Exports centralizados dos componentes de gráfico

### `/ui` - Componentes de Interface Genéricos
- **LoadingIndicator.tsx** - Indicador de carregamento reutilizável
- **index.ts** - Exports centralizados dos componentes de UI

## 🔄 Como Importar

### Importação Direta
```typescript
import TrackerChart from './components/dashboard/TrackerChart';
import { KPISection, SystemInfoLine } from './components/dashboard';
```

### Importação via Index (Recomendado)
```typescript
import { TrackerChart, KPISection, SystemInfoLine } from './components/dashboard';
import { TrackerForm, LocationFields } from './components/forms';
import { DashboardChart } from './components/charts';
import { LoadingIndicator } from './components/ui';
```

### Importação Global
```typescript
import { 
  TrackerChart, 
  KPISection, 
  TrackerForm, 
  DashboardChart, 
  LoadingIndicator 
} from './components';
```

## 🎯 Benefícios da Organização

1. **Manutenibilidade** - Fácil localização de componentes por funcionalidade
2. **Escalabilidade** - Estrutura preparada para novos componentes
3. **Reutilização** - Componentes UI genéricos podem ser reutilizados
4. **Clareza** - Separação clara entre dashboard, formulários, gráficos e UI
5. **Imports Limpos** - Arquivos index.ts facilitam as importações

## 📋 Convenções

- Cada pasta tem seu próprio `index.ts` para exports centralizados
- Componentes específicos ficam em suas respectivas pastas funcionais
- Componentes genéricos/reutilizáveis ficam em `/ui`
- Nomes de arquivos seguem PascalCase
- Exports seguem padrão named + default quando aplicável
