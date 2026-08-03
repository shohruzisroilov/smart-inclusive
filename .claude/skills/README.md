# Loyiha skill'lari

Bu papkadagi skill'lar `web/` loyihasiga bog'langan — reponi klon qilgan
har bir kishida avtomatik ishlaydi, alohida o'rnatish shart emas.

| Skill | Manba | Litsenziya |
|---|---|---|
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | `LICENSE.txt` ga qarang |
| `ui-ux-pro-max` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) v2.11.0 | MIT |

## Yangilash

```bash
# frontend-design
git clone --depth 1 --filter=blob:none --sparse \
  https://github.com/anthropics/skills.git /tmp/anthropic-skills
cd /tmp/anthropic-skills && git sparse-checkout set skills/frontend-design
cp -r /tmp/anthropic-skills/skills/frontend-design web/.claude/skills/

# ui-ux-pro-max (skill repo ildizida emas, `.claude/skills/` ichida yotadi)
git clone --depth 1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git /tmp/uiux
cp -r /tmp/uiux/.claude/skills/ui-ux-pro-max web/.claude/skills/
cp /tmp/uiux/LICENSE web/.claude/skills/ui-ux-pro-max/LICENSE
find web/.claude/skills -name __pycache__ -type d -exec rm -rf {} +
```

## Eslatma

`ui-ux-pro-max` ning `data/` papkasi ~1.7 MB — bu uning qidiriladigan
bazasi (ranglar, shriftlar, UX qoidalari), skillning ishlashi uchun shart.
Qidiruv shunday chaqiriladi:

```bash
python3 web/.claude/skills/ui-ux-pro-max/scripts/search.py \
  --stack vue --domain color "education children"
```
