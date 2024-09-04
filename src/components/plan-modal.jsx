import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlanModal = ({ isOpen, onClose, planId }) => {
    const [plan, setPlan] = useState(null);

    useEffect(() => {
        if (planId && isOpen) {
            const fetchPlan = async () => {
                try {
                    const response = await axios.get(`https://health-planner.onrender.com/planner/plans/${planId}`, {
                        headers: {
                            'Accept': 'application/json'
                        },
                        withCredentials: true,
                    });
                    setPlan(response.data);
                } catch (error) {
                    console.error('Failed to fetch plan details', error);
                }
            };

            fetchPlan();
        }
    }, [planId, isOpen]);

    if (!isOpen || !plan) return null;

    const formattedDescription = plan.description.replace(/\n/g, '<br />');

    return (
        <div className="fixed inset-0 z-50 flex lg:items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-[90%] lg:w-1/2 max-lg:mt-5 lg:h-[95vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Plan Details</h2>
                <p><strong>Type:</strong> {plan.plan_type}</p>
                <p><strong>Description:</strong> <span dangerouslySetInnerHTML={{ __html: formattedDescription }} /></p>
                <p><strong>Created At:</strong> {new Date(plan.created_at).toLocaleDateString()}</p>
                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-sky-500 text-white rounded-lg">Close</button>
                </div>
            </div>
        </div>
    );
};

export default PlanModal;