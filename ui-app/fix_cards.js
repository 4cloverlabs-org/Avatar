const fs = require('fs');
let content = fs.readFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', 'utf8');

const cardsRegex = /\{\/\* Card 1 \*\/\}.*?\{\/\* Aspect Dropdown List overlay \*\/\}/s;

const newCards = `{/* Card 1 */}
          <div 
            onClick={(e) => { e.stopPropagation(); setIsAvatarOpen(!isAvatarOpen); setIsAspectOpen(false); setIsVoiceOpen(false); }}
            style={{ background: '#ffffff', border: '1px solid #EEEEEE', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#EEEEEE'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedAvatar ? (
                  availableAvatars.find(a => a.id === selectedAvatar)?.type === 'system' ? (
                    <img src={availableAvatars.find(a => a.id === selectedAvatar)?.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.currentTarget.style.display = 'none'} />
                  ) : (
                    <video src={\`/api/serve_video?type=av&path=\${selectedAvatar}#t=0.001\`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} preload="metadata" muted playsInline onError={(e) => e.currentTarget.style.display = 'none'} />
                  )
                ) : (
                  <User size={16} color="#94a3b8" />
                )}
              </div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>{selectedAvatar ? getSelectedAvatarName() : "Custom Avatar ffb5"}</h3>
            </div>
            <ChevronDown size={16} color="#94a3b8" />
          </div>

          {/* Card 2 */}
          <div 
            onClick={(e) => { e.stopPropagation(); setIsVoiceOpen(!isVoiceOpen); setIsAvatarOpen(false); setIsAspectOpen(false); }}
            style={{ background: '#ffffff', border: '1px solid #EEEEEE', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#EEEEEE'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mic size={16} color="#64748b" />
              </div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>{selectedVoice ? (availableVoices.find(v => v.id === selectedVoice)?.name || "Rachel (Professional)") : "Rachel (Professional)"}</h3>
            </div>
            <ChevronDown size={16} color="#94a3b8" />
          </div>

          {/* Card 3 */}
          <div 
            onClick={(e) => { e.stopPropagation(); setIsAspectOpen(!isAspectOpen); setIsAvatarOpen(false); setIsVoiceOpen(false); }}
            style={{ position: 'relative', background: '#ffffff', border: '1px solid #EEEEEE', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#EEEEEE'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedAspect === '16/9' ? <Monitor size={16} color="#64748b" /> : selectedAspect === '9/16' ? <Smartphone size={16} color="#64748b" /> : <Square size={16} color="#64748b" />}
              </div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>{selectedAspect === '16/9' ? '16:9' : selectedAspect === '9/16' ? '9:16' : '1:1'}</h3>
            </div>
            <ChevronDown size={16} color="#94a3b8" />
            
            {/* Aspect Dropdown List overlay */}`;

content = content.replace(cardsRegex, newCards);
fs.writeFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', content);
console.log('Fixed cards size and layout');
