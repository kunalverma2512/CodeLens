export const docsRegistry = [
  {
    id: "practice-cp",
    sourceFile: "frontend/src/pages/PracticePage.jsx",
    route: "/practice",
    apiDependency: "https://codeforces.com/api/problemset.problems",
    status: "VERIFIED",
    component: "PracticeGuide",
    visibility: "visible"
  },
  {
    id: "github-intelligence",
    sourceFile: "frontend/src/pages/GitHubIntelligencePage.jsx",
    route: "/github-intelligence",
    apiDependency: "GET /github/dashboard, POST /github/sync",
    status: "VERIFIED",
    component: "GitHubIntelligenceGuide",
    visibility: "visible"
  },
  {
    id: "apex-ai",
    sourceFile: "frontend/src/pages/ApexWorkspacePage.jsx",
    route: "/apex-ai/workspace",
    apiDependency: "POST /apex/conversation, GET /apex/conversations",
    status: "VERIFIED",
    component: "ApexGuide",
    visibility: "visible"
  },
  {
    id: "algoverse",
    sourceFile: "frontend/src/pages/AlgoVersePage.jsx",
    route: "/algoverse",
    apiDependency: "none",
    status: "VERIFIED",
    component: "AlgoVerseGuide",
    visibility: "visible"
  },
  {
    id: "contest-arsenal",
    sourceFile: "frontend/src/pages/ContestCodeforcesPage.jsx",
    route: "/contests/codeforces",
    apiDependency: "none",
    status: "VERIFIED",
    component: "ContestArsenalGuide",
    visibility: "visible"
  }
];
