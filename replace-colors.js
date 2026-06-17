const fs = require('fs')
const path = require('path')
const replacements = [
  ['from-[#0075ff]','from-[#0075ff]'],
  ['via-[#0075ff]','via-[#0075ff]'],
  ['to-[#0053d1]','to-[#0053d1]'],
  ['to-[#0053d1]/50','to-[#0053d1]/50'],
  ['text-[#cce4ff]','text-[#cce4ff]'],
  ['text-[#e6f0ff]','text-[#e6f0ff]'],
  ['text-[#80b3ff]','text-[#80b3ff]'],
  ['text-[#0075ff]','text-[#0075ff]'],
  ['text-[#0075ff]','text-[#0075ff]'],
  ['text-[#0053d1]','text-[#0053d1]'],
  ['bg-[#eff4ff]','bg-[#eff4ff]'],
  ['bg-[#e6f0ff]','bg-[#e6f0ff]'],
  ['bg-[#0075ff]','bg-[#0075ff]'],
  ['bg-[#0053d1]','bg-[#0053d1]'],
  ['border-[#b3d7ff]','border-[#b3d7ff]'],
  ['border-[#7fb8ff]','border-[#7fb8ff]'],
  ['border-[#0075ff]','border-[#0075ff]'],
  ['hover:bg-[#eff4ff]','hover:bg-[#eff4ff]'],
  ['hover:bg-[#0053d1]','hover:bg-[#0053d1]'],
  ['hover:text-[#0075ff]','hover:text-[#0075ff]'],
  ['hover:text-[#0053d1]','hover:text-[#0053d1]'],
  ['hover:border-[#7fb8ff]','hover:border-[#7fb8ff]'],
  ['focus:ring-[#0075ff]','focus:ring-[#0075ff]'],
  ['focus:border-[#7fb8ff]','focus:border-[#7fb8ff]'],
  ['hover:border-[#7fb8ff]','hover:border-[#7fb8ff]']
]

function walk(dir) {
  let files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.next') continue
      files = files.concat(walk(full))
    } else if (/\.(tsx|ts|jsx|js|css|svg)$/i.test(entry.name)) {
      files.push(full)
    }
  }
  return files
}

const projectRoot = process.cwd()
const files = walk(projectRoot)
let changed = 0
for (const file of files) {
  const original = fs.readFileSync(file, 'utf8')
  let updated = original
  for (const [from, to] of replacements) {
    updated = updated.split(from).join(to)
  }
  if (updated !== original) {
    fs.writeFileSync(file, updated, 'utf8')
    console.log('updated', file)
    changed++
  }
}
console.log('updated files:', changed)
