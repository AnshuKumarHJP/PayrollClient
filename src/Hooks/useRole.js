import { useSelector } from 'react-redux';

/**
 * Custom hook to handle role-based logic
 * @returns {Object} { currentRole, isRole, hasAnyRole, isSuperAdmin }
 */
const useRole = () => {
    const currentRole = useSelector((state) => state.Auth?.Common?.SelectedRole);

    /**
     * Check if current user has a specific role
     * @param {string} roleCode - The role code to check (e.g., 'SuperAdmin')
     * @returns {boolean}
     */
    const isRole = (roleCode) => {
        return currentRole === roleCode;
    };

    /**
     * Check if current user has any of the specified roles
     * @param {string[]} roleCodes - Array of role codes
     * @returns {boolean}
     */
    const hasAnyRole = (roleCodes) => {
        return roleCodes.includes(currentRole);
    };

    /**
     * Role categories for convenience
     */
    const isSuperAdmin = ["SuperAdmin"].includes(currentRole);
    const isUser = ["PayrollOps"].includes(currentRole);
    const isClientUser = isSuperAdmin || ['Client', 'ClientManager'].includes(currentRole);

    // Approver role Check
    const isApprover = isSuperAdmin || ["PayrollTechnicalLead", "PayrollManager",].includes(currentRole);

    const currentPersonal = isApprover ? 'Manager' : isClientUser ? 'Client' : 'Operator';

    // Initiator role Check
    const isInitiator = ["Client"].includes(currentRole);
    // console.log(currentRole);

    return {
        currentRole,
        isRole,
        hasAnyRole,
        isSuperAdmin,
        isUser,
        isClientUser,
        currentPersonal,
        isApprover,
        isInitiator
    };
};

export default useRole;
