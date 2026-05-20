import {useState} from "react";

const faq_data=[
    {
        category: "GENERAL",
        ques: "What is CodeLens?",
        answer: " CodeLens is basically a developer platform. CodeLens aggregates your GitHub, LeetCode, and Codeforces data into a single AI-powered command center that tells you exactly what to learn next.",
    },
    {
        category: "GENERAL",
        ques: "How does CodeLens help developers?",
        answer: " It helps users track coding progress, analyze profiles, explore various contests, and improve problem-solving consistency across multiple coding platforms",
    },
    { 
        category: "GENERAL",
        ques: "What are different platforms integrated with CodeLens?",
        answer: "CodeLens currently supports integrations and tracking with platforms like LeetCode, Codeforces , CodeChef, Git and GitHub",
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
        ques: "Can I track upcoming coding contests on CodeLens?",
        answer: "Yes. CodeLens provides contest tracking for multiple competitive programming platform in one centralized interface.",
    },
    {
        category: "CONTESTS",
        ques: "Does CodeLens support contests for beginners?",
        answer: "Yes. CodeLens tracks contests suitable for both beginners and experienced competitive programmers across multiple platforms."
    },
    {
        category: "CONTESTS",
        ques: "Can users receive reminders for upcoming contests?",
        answer: "CodeLens helps users stay informed about upcoming contests so they never miss important competitive programming events."
    },
    {
        category: "DASHBOARD",
        ques: "What kind of insights does the dashboard provide? ",
        answer: "The dashboard provides insights into coding activity, platform statistics, problem-solving progress, and overall performance across integrated platforms in one place.",
    },
    {
        category: "DASHBOARD",
        ques: "Does the dashboard update coding statistics automatically?",
        answer: "The dashboard regularly updates coding statistics and activity from connected platforms to keep progress insights accurate."
    },
    {
        category: "DASHBOARD",
        ques: "Can the dashboard help identify weak areas in coding preparation?",
        answer: "Yes. The dashboard helps users analyze performance trends and identify areas where additional practice may be needed."
    },
];

export default function FAQpage(){

const [selectedCategory, setSelectedCategory] = useState("GENERAL");
const[openQuestion, setOpenQuestion]=useState(null);

    return(
        <div
            className="min-h-screen p-8 bg-white text-black dark:bg-black dark:text-white">
            <h1 className="text-5xl font-bold">
                FREQUENTLY ASKED QUESTIONS 
            </h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
                Find answers about CodeLens: tools, contests, accounts and features
            </p>

        <div
            className="flex gap-4 mt-10">
                <button 
                aria-pressed={selectedCategory === "GENERAL"}
                onClick={() => {
                    setSelectedCategory("GENERAL");
                    setOpenQuestion(null);
                }}
                className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                    selectedCategory==="GENERAL"
                    ?"bg-black text-white dark:bg-white dark:text-black"
                    :"bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                }`}>
                    GENERAL
                </button>
                <button 
                aria-pressed={selectedCategory === "TOOLS"}
                onClick={() => {
                    setSelectedCategory("TOOLS");
                    setOpenQuestion(null);
                }}
                className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                    selectedCategory==="TOOLS"
                    ?"bg-black text-white dark:bg-white dark:text-black"
                    :"bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                }`}>
                    TOOLS
                </button>
                <button 
                aria-pressed={selectedCategory === "CONTESTS"}
                onClick={() => {
                    setSelectedCategory("CONTESTS");
                    setOpenQuestion(null);
                }}
                className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                    selectedCategory==="CONTESTS"
                    ?"bg-black text-white dark:bg-white dark:text-black"
                    :"bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                }`}>
                    CONTESTS
                </button>
                <button 
                aria-pressed={selectedCategory === "DASHBOARD"}
                onClick={() => {
                    setSelectedCategory("DASHBOARD");
                    setOpenQuestion(null);
                }}
                className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                    selectedCategory==="DASHBOARD"
                    ?"bg-black text-white dark:bg-white dark:text-black"
                    :"bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                }`}>
                    DASHBOARD
                    
                </button>
                

            </div>

        <div
            className="mt-10 space-y-4">
                {faq_data
                    .filter((item)=> item.category===selectedCategory)
                    .map((item,index)=>(
                    <div
                        key={`${item.category}-${item.ques}`}
                        onClick={()=>
                            setOpenQuestion(
                                openQuestion ===index?null:index
                            )
                        }
                            className="border rounded-2xl p-5 cursor-pointer hover:shadow-lg transition-all duration-300"  
                    >
                    


            <div
                role="button"
                tabIndex={0}
                onKeyDown={(e)=>{
                    if(e.key === "Enter" || e.key === " "){
                        setOpenQuestion(openQuestion===index?null:index);
                    }
                }}
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
                            <p className="mt-3 text-gray-600 dark:text-gray-300">
                            {item.answer}
                        </p>

                        )}
                        </div>
                        
                    </div>

                ))}
        </div>
    </div>
        
    );
};


