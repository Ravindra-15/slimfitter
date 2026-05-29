/**
 * ============================================
 * CUSTOMER MODULE — Public Program Plan Service
 * ============================================
 * Fetches subscription plans for landing pages and tenure selection.
 * NO auth required. Backed by /api/customer/program-plans/:programId.
 *
 * Used by:
 *  - PricingSection (landing page card)
 *  - SelectTenure (tenure picker after Get Started)
 * ============================================
 */

import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ============================================
// 📋 GET PUBLIC PLANS FOR A PROGRAM
// ============================================
/**
 * @param {string} programId - yogat20 | diabmukt | mommyfit | slimfitter
 * @param {Object} [opts]
 * @param {boolean} [opts.landingOnly] - if true, returns only plans flagged visible on landing
 * @returns Promise<Array<Plan>>
 */
export const getPublicProgramPlans = async (programId, opts = {}) => {
  const params = {};
  if (opts.landingOnly) params.landing = "true";

  const response = await axios.get(
    `${API_BASE}/customer/program-plans/${programId}`,
    { params }
  );

  return response.data?.data?.plans || [];
};