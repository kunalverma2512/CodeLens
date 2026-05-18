import {useState} from "react";

function FAQ(){
    
    const faq=[
    {
        category: "GENERAL",
        ques: "What is CodeLens?",
        answer: " CodeLens is basically a developer platform. CodeLens aggregates your GitHub, LeetCode, and Codeforces data into a single AI-powered command center that tells you exactly what to learn next.",
    },
    {
        category: "GENERAL",
        ques: "How does Codelens help developers?",
        answer: " It helps users track coding progresses, analyze profiles, explore various contests, and improve problem-solving consistency across multiple coding platforms",
    },
    { 
        category: "GENERAL",
        ques: "What are different platform integrated with CodeLens?",
        answer: "CodeLens currently supports integrations and tracking with platforms like LeetCode, Codeforces , Codechef, Git and Github",
    },
    {
        category: "TOOLS",
        ques: "Which type of tools are provided?",
        answer: "CodeLens offers AI-powered developer tools",
    },
    {
        category: "TOOLS",
        ques: "What is Vela AI used for?",
        answer: "Vela AI helps developers receive intelligent coding guidance, recommendations, and assistance inside the CodeLens platform.",
    },
    {
        category:"TOOLS",
        ques: "How does Apex AI improve coding preparation?",
        answer: "Apex AI analyzes user activity and provides insights , recommendations, and learning assistance for competitive programming improvement.",
    },
    {
        category: "CONTESTS",
        ques: "Are upcoming coding constests tracked on CodeLens?",
        answer: "YES. CodeLens provides constest tracking for multiple competitive programming platform in one centralized interface.",
    },
    {
        category: "DASHBOARD",
        ques: "What insights are available in the dashboard? ",
        answer: "The dashboard helps users monitor coing activity, platform statistics and progress across the platforms used in one place.",
    },
];

const [selectedCategory, setSelectedCategory] = useState("GENERAL");
const[openQuestion, setOpenQuestion]=useState(null);

    return(
        <div
            className="min-h-screen p-8">
            <h1 className="text-5xl font-bold">
                FREQUENTLY ASKED QUESTIONS 
            </h1>
            <p className="mt-4 text-gray-500">
                Find answers about CodeLens: tools, contests, accounts and features
            </p>

        <div
            className="flex gap-4 mt-10">
                <button onMouseEnter={() => setSelectedCategory("GENERAL")}>
                    GENERAL
                </button>
                <button onMouseEnter={() => setSelectedCategory("TOOLS")}>
                    TOOLS
                </button>
                <button onMouseEnter={() => setSelectedCategory("CONTESTS")}>
                    CONTESTS
                </button>
                <button onMouseEnter={() => setSelectedCategory("DASHBOARD")}>
                    DASHBOARD
                </button>
                

            </div>

        <div
            className="mt-10 space-y-4">
                {faq
                    .filter((item)=> item.category===selectedCategory)
                    .map((item,index)=>(
                    <div
                        key={index}
                        onClick={()=>
                            setOpenQuestion(
                                openQuestion ===index?null:index
                            )
                        }
                            className="border rounded-2xl p-5 cursor-pointer hover:shadow-lg transition-all duration-300"  
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">
                                {item.ques}
                            </h2>
                            <span className="text-3xl">
                                {openQuestion===index?"-":"+"}
                            </span>
                        </div>
                        
                        {openQuestion ===index &&(
                            <p className="mt-3 text-gray-600">
                            {item.answer}
                        </p>

                        )}
                        
                    </div>

                ))}
        </div>
        </div>
        
    );
};

export default FAQ;
