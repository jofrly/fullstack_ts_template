export function seedData(group: string, test: string): void {
    require('child_process').execSync(`cd ../api && yarn e2e-seed -- bin/e2e_seeds/${group}/${test}.ts`);
}
