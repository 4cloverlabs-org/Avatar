const fs = require('fs');
let content = fs.readFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', 'utf8');

const topCardsStr = `        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          
          {/* Card 1 */}
          <div 
            onClick={(e) => { e.stopPropagation(); setIsAvatarOpen(!isAvatarOpen); setIsAspectOpen(false); setIsVoiceOpen(false); }}
            style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer' }}
          >
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--foreground)' }}>{selectedAvatar ? getSelectedAvatarName() : "Custom Avatar ffb5"}</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>Active</span>
              <span style={{ background: '#fef2f2', color: '#ef4444', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>Co-pilot</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <span style={{ background: '#f8fafc', color: '#64748b', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 500 }}>frontend • 8 files</span>
              <span style={{ background: '#f8fafc', color: '#64748b', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 500 }}>expo-router</span>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            onClick={(e) => { e.stopPropagation(); setIsVoiceOpen(!isVoiceOpen); setIsAvatarOpen(false); setIsAspectOpen(false); }}
            style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer' }}
          >
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--foreground)' }}>{selectedVoice ? (availableVoices.find(v => v.id === selectedVoice)?.name || "Rachel (Professional)") : "Rachel (Professional)"}</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ background: '#f1f5f9', color: '#64748b', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>Offline</span>
              <span style={{ background: '#f5f3ff', color: '#8b5cf6', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>Plan</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <span style={{ background: '#f8fafc', color: '#64748b', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 500 }}>frontend • 12 files</span>
              <span style={{ background: '#f8fafc', color: '#64748b', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 500 }}>expo-router</span>
            </div>
          </div>

          {/* Card 3 */}
          <div 
            onClick={(e) => { e.stopPropagation(); setIsAspectOpen(!isAspectOpen); setIsAvatarOpen(false); setIsVoiceOpen(false); }}
            style={{ position: 'relative', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer' }}
          >
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--foreground)' }}>{selectedAspect === '16/9' ? '16:9' : selectedAspect === '9/16' ? '9:16' : '1:1'}</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>Active</span>
              <span style={{ background: '#eef2ff', color: '#6366f1', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>Autonomous</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <span style={{ background: '#f8fafc', color: '#64748b', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 500 }}>frontend • 14 files</span>
              <span style={{ background: '#f8fafc', color: '#64748b', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 500 }}>useAuth</span>
            </div>
            
            {/* Aspect Dropdown List overlay */}
            {isAspectOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 8, width: 140, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 6, zIndex: 100, display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
                {[
                  { val: '16/9', label: '16:9 Landscape' },
                  { val: '9/16', label: '9:16 Portrait' },
                  { val: '1/1', label: '1:1 Square' }
                ].map(opt => (
                  <div
                    key={opt.val}
                    style={{ padding: '8px 12px', fontSize: 12, cursor: 'pointer', background: selectedAspect === opt.val ? '#f1f5f9' : 'transparent', color: '#1e293b', borderRadius: 8, fontWeight: selectedAspect === opt.val ? 600 : 400 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAspect(opt.val);
                      localStorage.setItem('ai_assistant_aspect', opt.val);
                      setIsAspectOpen(false);
                    }}
                    onMouseEnter={(e) => { if (selectedAspect !== opt.val) e.currentTarget.style.background = '#f8fafc'; }}
                    onMouseLeave={(e) => { if (selectedAspect !== opt.val) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>`;

// I need to replace the flex container that currently holds the pills, with these topCards.
// And I need to extract the Avatar/Voice Modals from the flex container and keep them!

const pillsRegex = /<div style=\{\{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' \}\}>([\s\S]*?)<\/div>\s*<\/div>\s*\{\/\* Console Box \*\/\}/;

const match = content.match(pillsRegex);
if (!match) process.exit(1);

const flexContent = match[1];

// Find Avatar and Voice modal overlays inside the flex content
const avatarModalRegex = /\{\/\* Avatar Modal Overlay \*\/\}([\s\S]*?)\{\/\* Voice Modal Overlay \*\/\}/;
const voiceModalRegex = /\{\/\* Voice Modal Overlay \*\/\}([\s\S]*)$/;

const avatarModalMatch = flexContent.match(avatarModalRegex);
const voiceModalMatch = flexContent.match(voiceModalRegex);

let avatarModalCode = '';
let voiceModalCode = '';

if (avatarModalMatch) {
  avatarModalCode = `{/* Avatar Modal Overlay */}${avatarModalMatch[1]}`;
}
if (voiceModalMatch) {
  voiceModalCode = `{/* Voice Modal Overlay */}${voiceModalMatch[1]}`;
}

const newReplacement = `${topCardsStr}\n${avatarModalCode}\n${voiceModalCode}\n      </div>\n\n      {/* Console Box */}`;

content = content.replace(pillsRegex, newReplacement);

fs.writeFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', content);
console.log("Success");
