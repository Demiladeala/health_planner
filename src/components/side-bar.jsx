import { motion } from "framer-motion";
import {  useEffect, useState } from "react";
import { IoFitnessOutline } from "react-icons/io5";
import { API } from "../pages/Home";
import LogoutModal from "./logout";
import { useWebSocket } from "../context/WebSocketContext";
import PlanModal from "./plan-modal";
import axios from "axios";

const Sidebar = () => {
    const {name} = useWebSocket();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [plans, setPlans] = useState([]);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [planSelected, setPlanSelected] = useState(false);

     const Link = () => { 
       return (
        <motion.div
        onClick={() => setPlanSelected(!planSelected)}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        >
        <button className={`w-full flex items-center gap-2 transition-all duration-300 py-3 px-4 rounded-lg ${
        planSelected ? "bg-primary-gray text-white" : 
        "w-[90%] text-[#565E6C] hover:bg-primary-purple/10 hover:text-gray-20"
        }`}>
            <motion.div
                whileHover={{ rotate: [0, 10, -10, 0] }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <IoFitnessOutline size={24} /> 
            </motion.div>
            <h4>Plans</h4>
        </button>
        </motion.div>
       )
    };

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get(`${API}/planner/plans/`, {
                    headers: {
                        'Accept': 'application/json'
                    },
                    withCredentials: true,
                });
                setPlans(response.data);
            } catch (error) {
                console.error('Failed to fetch plans', error);
            }
        };

        fetchPlans();
    }, []);

    const logout = async () => {
        try {
          await axios.post(`${API}/auth/logout`, null, {
            headers: {
              'Accept': 'application/json'
            },
            withCredentials: true // Include this if using cookies for authentication
          });
          // Redirect or update state after successful logout
          window.location.href = '/'; // Or any other redirect logic
        } catch (error) { 
            if (error.response) {
                const { status, data } = error.response;
                if (status === 400 || status === 404 || status === 401) {
                  // Display the error message from the API response
                  const errorMessage = data.message || data.detail.msg || 'An error occurred. Please try again.';
                  toast.error(errorMessage);
                } else {
                  // Handle other errors
                  toast.error('Failed to Login. Please try again.');
                }
              } else {
                // Handle cases where there is no response from the server
                toast.error('An unexpected error occurred. Please try again.');
              }
              console.error('Logout failed', error.response.data);
        }
      };

      const handlePlanClick = (planId) => {
        setSelectedPlanId(planId);
        setIsPlanModalOpen(true);
    };

  return (
    <>
        {/* Hamburger Button for Mobile */}
        <div className="lg:hidden fixed top-0 left-0 w-full 
        flex items-center justify-between box-shadow p-3 bg-white border-b z-30">

            <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex-shrink-0 rounded-full">
                    <a href="/">
                    <img
                        src={`/bot.png`} 
                        alt="profile img" 
                        className="w-full h-full object-cover rounded-full border"
                    />
                    </a>
                </div>

                <h4 className="text-sm font-medium text-gray-800">Meal and fitness 
                    <br className="md:hidden"/>&nbsp;planner.</h4>
            </div>
                
            <div className="lg:hidden mb-2 top-4 right-4 ">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-full 
                bg-primary-darkblue text-primary-gray2">
                    <span className="sr-only">Open menu</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>
        </div>
        {/* Hamburger Button for Mobile */}

        {/* Mobile Menu */}
        <div className={`fixed inset-0 z-40 bg-white px-5 border-r border-gray-100 text-primary-black lg:hidden transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}>
            <div className="w-full h-full">
                <div className="px-1 py-3 flex items-center justify-end">
                    <button onClick={() => setIsMobileMenuOpen(false)} 
                    className="text-primary-black relative top-[3px] left-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        <span className="sr-only">Close menu</span>
                    </button>
                </div>

                <div className="mt-6 w-full text-sm font-medium">
                    <Link/>
                    {planSelected && (
                        <ul className="mt-4">
                            {plans.map(plan => (
                                <li key={plan.id}>
                                    <button
                                        onClick={() => handlePlanClick(plan.id)}
                                        className="w-full flex items-center text-primary-black gap-2 py-3 px-4 rounded-lg 
                                        hover:bg-primary-purple/10 hover:text-gray-600">
                                        <h4>{plan.plan_type}</h4>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                     <div className="bottom-0 w-full px-4 py-3">
                        <button
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="w-full flex items-center gap-2 py-3 rounded-lg text-gray-600 hover:text-gray-100">
                            <span className="text-red-600">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {/* Mobile Menu */}


        <div className="pt-12 lg:hidden"></div>

        <div className="z-[3] fixed max-lg:hidden w-[16%] h-screen overflow-y-auto bg-[#F5F2FD] text-gray-200 
            ml-2 mt-2 mb-4 pb-4 border-r border-gray-100">
            <div className="mt-6 px-5 flex items-center gap-3">
                <div className="w-12 h-12 flex-shrink-0 rounded-full">
                    <a href="/">
                    <img
                        src={`/bot.png`} 
                        alt="profile img" 
                        className="w-full h-full object-cover rounded-full border"
                    />
                    </a>
                </div>

                <h4 className="text-sm font-medium text-gray-800">Meal and fitness planner.</h4>
            </div>

            <div className="mt-16 lg:mt-8 xl:mt-16 w-[90%] mx-auto text-sm font-medium"></div>
            <Link/>

            {planSelected && (
                <ul className="mt-4">
                    {plans.map(plan => (
                        <li key={plan.id}>
                            <button
                                onClick={() => handlePlanClick(plan.id)}
                                className="w-full flex items-center text-primary-black gap-2 py-3 px-4 rounded-lg 
                                hover:bg-primary-purple/10 hover:text-gray-600">
                                <h4>{plan.plan_type}</h4>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div className="absolute bottom-5 w-full">
                <div className="w-[91%] mx-auto bg-white/80 py-3 px-4 border border-dashed text-gray-600">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-full">
                            <img
                                src={`/profile.png`} 
                                alt="profile img" 
                                className="w-full h-full object-cover rounded-full border"
                            />
                        </div>
                        <h3 className="text-sm">{name}</h3>
                    </div>
                    <div className="pt-3">
                        <button
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="w-full flex items-center gap-2  rounded-lg text-gray-600 hover:text-gray-100">
                            <span className="text-red-600">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <PlanModal
            isOpen={isPlanModalOpen}
            onClose={() => setIsPlanModalOpen(false)}
            planId={selectedPlanId}
        />

        <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={async () => {
          await logout();
          setIsLogoutModalOpen(false);
        }}
      />
    </>
  )
}

export default Sidebar