#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const root = resolve(process.argv[2] ?? process.cwd())
const maxFiles = 5000
const ignore = new Set([
  '.git', 'node_modules', 'dist', 'build', 'coverage', '.next', '.turbo',
  '.cache', 'out', 'vendor',
])
const testPattern = /(?:^|\/)(?:__tests__\/.*|.*\.(?:test|spec)\.[cm]?[jt]sx?|.*\.(?:test|spec)\.tsx?)$/
const configPattern = /(?:^|\/)(?:vitest|jest|playwright|cypress|mocha|ava|karma)(?:\.config)?\.[cm]?[jt]s$|(?:^|\/)cypress\.config\.[cm]?[jt]s$/
const setupPattern = /(?:^|\/)(?:setupTests|test-setup|setup-tests|vitest\.setup|jest\.setup)\.[cm]?[jt]sx?$/i
const ciPattern = /(?:^|\/)\.github\/workflows\/.*\.ya?ml$|(?:^|\/)(?:\.gitlab-ci\.yml|Jenkinsfile|circle\.yml)$/

function readJson(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')) }
  catch (error) {
    console.error(`Unable to parse ${path}: ${error.message}`)
    process.exitCode = 1
    return undefined
  }
}

function walk(dir, files = []) {
  if (files.length >= maxFiles) return files
  let entries
  try { entries = readdirSync(dir) }
  catch (error) {
    console.error(`Unable to read ${dir}: ${error.message}`)
    process.exitCode = 1
    return files
  }
  for (const name of entries) {
    if (ignore.has(name)) continue
    const path = join(dir, name)
    let stat
    try { stat = statSync(path) }
    catch { continue }
    if (stat.isDirectory()) walk(path, files)
    else files.push(relative(root, path).replaceAll('\\', '/'))
    if (files.length >= maxFiles) break
  }
  return files
}

function printList(title, values) {
  console.log(`\n## ${title}`)
  if (!values.length) console.log('- none found')
  else values.sort().forEach((value) => console.log(`- ${value}`))
}

if (!existsSync(root)) {
  console.error(`Repo root does not exist: ${root}`)
  process.exit(1)
}

console.log(`# Test surface: ${root}`)
const packagePath = join(root, 'package.json')
if (existsSync(packagePath)) {
  const pkg = readJson(packagePath)
  if (pkg) {
    console.log('\n## Package scripts')
    const scripts = pkg.scripts ?? {}
    const matches = Object.entries(scripts).filter(([name, command]) =>
      /test|coverage|typecheck|lint|e2e|playwright|cypress|vitest|jest|stryker/i.test(`${name} ${command}`),
    )
    if (!matches.length) console.log('- none found')
    else matches.forEach(([name, command]) => console.log(`- ${name}: ${command}`))

    console.log('\n## Likely test dependencies')
    const deps = { ...pkg.dependencies, ...pkg.devDependencies }
    const depMatches = Object.keys(deps).filter((name) =>
      /vitest|jest|testing-library|playwright|cypress|mocha|ava|stryker|msw|tsx?|eslint/i.test(name),
    )
    if (!depMatches.length) console.log('- none found')
    else depMatches.sort().forEach((name) => console.log(`- ${name}: ${deps[name]}`))
  }
} else {
  console.log('\n## Package scripts\n- package.json not found')
}

const files = walk(root)
if (files.length >= maxFiles) console.error(`\nWarning: file scan capped at ${maxFiles} files.`)
printList('Test files', files.filter((file) => testPattern.test(file)))
printList('Test config', files.filter((file) => configPattern.test(file)))
printList('Setup files', files.filter((file) => setupPattern.test(file)))
printList('CI files', files.filter((file) => ciPattern.test(file)))
