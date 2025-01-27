const { execSync } = require("child_process");
const fs = require("fs");

// Function to generate a random past date within the last year
function getRandomPastDate() {
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - Math.floor(Math.random() * 365)); // Random day in the past year

    // Ensure date is not in the future
    if (pastDate > today) {
        pastDate.setDate(today.getDate() - 1);
    }

    return pastDate.toISOString().slice(0, 19).replace("T", " "); // Format: YYYY-MM-DD HH:mm:ss
}

// Number of commits you want to make
const NUM_COMMITS = 250;

// Creating a function to automate commits and push them to GitHub
async function createAndPushCommits() {
    for (let i = 0; i < NUM_COMMITS; i++) {
        const commitDate = getRandomPastDate();

        console.log(`Creating commit for date: ${commitDate}`);

        try {
            // Modify or create a dummy file (to avoid empty commits)
            const fileName = 'dummy.txt';
            const fileContent = `This is commit number ${i + 1} made on ${commitDate}`;
            fs.writeFileSync(fileName, fileContent);  // Write the commit content to the file

            // Set GIT_COMMITTER_DATE and GIT_AUTHOR_DATE
            execSync(
                `set GIT_COMMITTER_DATE="${commitDate}" GIT_AUTHOR_DATE="${commitDate}" git commit -am "Commit on ${commitDate}" --date "${commitDate}"`,
                { stdio: "inherit", shell: "cmd.exe" }
            );

            // Optional: Delay 1 second between commits
            await new Promise(resolve => setTimeout(resolve, 1000));  // Delay 1 second between commits

        } catch (error) {
            console.error(`Error creating commit on ${commitDate}:`, error);
        }
    }

    // After all commits are created, push them to GitHub
    try {
        console.log("Pushing all commits to GitHub...");
        execSync("git push origin main --force", { stdio: "inherit" });
        console.log("✅ All commits pushed successfully! Check your GitHub contribution graph.");
    } catch (error) {
        console.error("Error pushing commits to GitHub:", error);
    }
}

// Call the function to start creating and pushing commits
createAndPushCommits();
