p='functions/api/curriculum-advanced/engines/geo/vectorsEngine.js'
s=open(p,encoding='utf-8').read()
old="    explanation: T(`${co(m)}\\vec{a}${n > 0 ? '+' : ''}${co(n)}\\vec{b}=${vec(r[0], r[1])}$ 이므로 $|${co(m)}\\vec{a}${n > 0 ? '+' : ''}${co(n)}\\vec{b}|^2=${r[0] * r[0]}+${r[1] * r[1]}=${r[0] * r[0] + r[1] * r[1]}$`.replace(/^/, '$'),"
new="    explanation: T(`$${co(m)}\\vec{a}${n > 0 ? '+' : ''}${co(n)}\\vec{b}=${vec(r[0], r[1])}$ 이므로 $|${co(m)}\\vec{a}${n > 0 ? '+' : ''}${co(n)}\\vec{b}|^2=${r[0] * r[0]}+${r[1] * r[1]}=${r[0] * r[0] + r[1] * r[1]}$`,"
assert old in s
s=s.replace(old,new)
a=s.index("    prompt: T(`두 벡터 $\\vec{a}=${vec(a[0], a[1])},\\ \\vec{b}=${vec(u, v)}$ 에 대하여 $\\vec{a}$ 를 $\\vec{b}$ 위로")
b=s.index("    verify:",a)
new="""    prompt: T(`두 벡터 $\\vec{a}=${vec(a[0], a[1])},\\ \\vec{b}=${vec(u, v)}$ 에 대하여 $\\vec{a}$ 를 $\\vec{b}$ 위로 정사영시킨 벡터를 $\\vec{c}$ 라 할 때, $|\\vec{c}|\\times|\\vec{b}|$ 의 값은?`,
      `Find |c|·|b| where c is the projection of a onto b.`),
    answer: Fr(Math.abs(dot(a, b))),
    explanation: T(`$|\\vec{c}|=\\frac{|\\vec{a}\\cdot\\vec{b}|}{|\\vec{b}|}$ 이므로 $|\\vec{c}|\\times|\\vec{b}|=|\\vec{a}\\cdot\\vec{b}|=|${a[0]}\\cdot ${u}+${num(a[1])}\\cdot ${v}|=${Math.abs(dot(a, b))}$`,
      `|a·b| = ${Math.abs(dot(a, b))}.`),
"""
s=s[:a]+new+s[b:]
s=s.replace("    verify: () => near((dot(a, b) / Math.hypot(u, v)) * Math.hypot(u, v), dot(a, b)) && near(fnum(proj) * w, dot(a, b)),","    verify: () => { near(Math.abs(dot(a, b)) / Math.hypot(u, v) * w, Math.abs(dot(a, b))); return Math.abs(dot(a, b)); },")
s=s.replace("  const proj = Fr(dot(a, b), w);\n","")
open(p,'w',encoding='utf-8').write(s)
print('ok')
