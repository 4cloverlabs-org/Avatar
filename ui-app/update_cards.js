const fs = require('fs');
let content = fs.readFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', 'utf8');

const cardsRegex = /\{\/\* Card 1 \*\/\}.*?\{\/\* Aspect Dropdown List overlay \*\/\}/s;

const newCards = `{/* Card 1 */}
          <div 
            onClick={(e) => { e.stopPropagation(); setIsAvatarOpen(!isAvatarOpen); setIsAspectOpen(false); setIsVoiceOpen(false); }}
            style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--foreground)' }}>{selectedAvatar ? getSelectedAvatarName() : "Custom Avatar ffb5"}</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>Active</span>
              <span style={{ background: '#fef2f2', color: '#ef4444', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>Custom</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <span style={{ background: '#f8fafc', color: '#64748b', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 500 }}>4K Video • Ready</span>
              <span style={{ background: '#f8fafc', color: '#64748b', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 500 }}>High Quality</span>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            onClick={(e) => { e.stopPropagation(); setIsVoiceOpen(!isVoiceOpen); setIsAvatarOpen(false); setIsAspectOpen(false); }}
            style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--foreground)' }}>{selectedVoice ? (availableVoices.find(v => v.id === selectedVoice)?.name || "Rachel (Professional)") : "Rachel (Professional)"}</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>Ready</span>
              <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>Cloned</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <span style={{ background: '#f8fafc', color: '#64748b', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 500 }}>English (US) • Clear</span>
              <span style={{ background: '#f8fafc', color: '#64748b', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 500 }}>Studio</span>
            </div>
          </div>

          {/* Card 3 */}
          <div 
            onClick={(e) => { e.stopPropagation(); setIsAspectOpen(!isAspectOpen); setIsAvatarOpen(false); setIsVoiceOpen(false); }}
            style={{ position: 'relative', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--foreground)' }}>{selectedAspect === '16/9' ? '16:9' : selectedAspect === '9/16' ? '9:16' : '1:1'}</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ background: '#faf5ff', color: '#a855f7', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>{selectedAspect === '16/9' ? 'Landscape' : selectedAspect === '9/16' ? 'Portrait' : 'Square'}</span>
              <span style={{ background: '#eef2ff', color: '#6366f1', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>HD</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <span style={{ background: '#f8fafc', color: '#64748b', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 500 }}>{selectedAspect === '16/9' ? '1920x1080' : selectedAspect === '9/16' ? '1080x1920' : '1080x1080'}</span>
              <span style={{ background: '#f8fafc', color: '#64748b', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 500 }}>Optimized</span>
            </div>
            
            {/* Aspect Dropdown List overlay */}`;

content = content.replace(cardsRegex, newCards);
fs.writeFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', content);
console.log('Updated cards');
