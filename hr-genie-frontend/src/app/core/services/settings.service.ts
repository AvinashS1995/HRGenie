import { Injectable, signal } from '@angular/core';
import { AISettings, ApprovalLevel } from '../models';
import { MOCK_AI_SETTINGS, MOCK_APPROVAL_LEVELS } from '../mock/mock-data';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private _aiSettings = signal<AISettings>(MOCK_AI_SETTINGS);
  private _approvalLevels = signal<ApprovalLevel[]>(MOCK_APPROVAL_LEVELS);

  getAISettings(): AISettings { return this._aiSettings(); }
  saveAISettings(settings: AISettings): void { this._aiSettings.set(settings); }

  getApprovalLevels(): ApprovalLevel[] { return this._approvalLevels(); }
  saveApprovalLevels(levels: ApprovalLevel[]): void { this._approvalLevels.set(levels); }

  getModels(provider: string): string[] {
    switch (provider) {
      case 'OpenAI': return ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'];
      case 'Gemini': return ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'];
      case 'OpenRouter': return ['anthropic/claude-3-opus', 'meta-llama/llama-3-70b', 'mistralai/mistral-large'];
      default: return [];
    }
  }
}
