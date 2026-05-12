module.exports = {
  /** Custom target that performs minor upgrades for the p-queue package.
    @param dependencyName The name of the dependency.
    @param parsedVersion A parsed Semver object from semver-utils.
      (See https://git.coolaj86.com/coolaj86/semver-utils.js#semverutils-parse-semverstring)
    @returns 'latest' | 'newest' | 'greatest' | 'minor' | 'patch'
  */
  target: (dependencyName, parsedVersion) => {
    return dependencyName === 'bootstrap' ? 'minor' : 'latest'
  }
}