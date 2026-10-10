p='functions/api/curriculum-advanced/engines/geo/conicsEngine.js'
s=open(p,encoding='utf-8').read()
a=s.index("    explanation: T(`꼭짓점은 초점과 준선의 중점")
b=s.index("    verify:",a)
new="""    explanation: T(`꼭짓점은 초점과 준선의 중점 $(${v},\\ ${k})$ 이고 $p=${p}$ 이므로 포물선의 방정식은 $(y${k === 0 ? '' : k > 0 ? `-${k}` : `+${-k}`})^2=${4 * p}(x${v === 0 ? '' : v > 0 ? `-${v}` : `+${-v}`})$ 이다.\n점 $(a,\\ ${yA})$ 를 대입하면 $${(yA - k) ** 2}=${4 * p}(a${v === 0 ? '' : v > 0 ? `-${v}` : `+${-v}`})$ 이므로 $a=${a}$`,
      `Vertex (${v}, ${k}), p=${p}.`),
"""
s=s[:a]+new+s[b:]
a=s.index("    explanation: T(`$\\frac{dx}{dt}=2t-${2 * k},")
b=s.index("      `Minimum at t=(k+m)/2.`),",a)
new="""    explanation: T(`$\\frac{dx}{dt}=2t-${2 * k},\\ \\frac{dy}{dt}=2t-${2 * m}$ 이므로 속력의 제곱은 $(2t-${2 * k})^2+(2t-${2 * m})^2$ 이고, 이 이차식은 $t=\\frac{${k}+${m}}{2}=${tmin}$ 에서 최소이다.`,
"""
s=s[:a]+new+s[b:]
open(p,'w',encoding='utf-8').write(s)
print('ok')
