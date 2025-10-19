import { supabase } from '../utils/supabaseClients';

interface ProfileData {
  // Basic info
  profileid: number;
  firstName: string;  
  lastName: string;   
  birthdate: string;
  age: number;
  contactnum: string;

  // Address info
  barangay: string;
  municipality: string;
  province: string;
  zipcode: string;
}

interface EducationData {
  educationid: number;
  profileid: number;
  elementary: string;
  juniorHigh: string;
  seniorHigh: string;
  college: string;
}

interface MaternalHealthData {
    health_id: number;
    profileid: number;
    pregnancy_status: string;
    medical_history: string;
    support_type: string;
    current_stage?: string; 
}

export async function saveCompleteProfile(
  profileData: ProfileData,
  educationData: EducationData,
  maternalHealthData: MaternalHealthData
) {
  try {
    
    //Insert into profile table
    const { data: profileResult, error: profileError } = await supabase
      .from('profile')
      .insert([profileData])
      .select('profileid');

    if (profileError) throw profileError;

    const profileid = profileResult[0].profileid;

    //Insert into EducationAndTraining table
    const { data: educationResult, error: educationError } = await supabase
      .from('EducationAndTraining')
      .insert([{...educationData,profileid}]);

    if (educationError) {
      // Rollback profile insertion
      await supabase
        .from('profile')
        .delete()
        .match({ profileid: profileid });
      throw educationError;
    }

    //Insert into maternalhealthRecord table
    const { data: healthResult, error: healthError } = await supabase
      .from('maternalhealthRecord')
      .insert([{...maternalHealthData, profileid}]);

    if (healthError) {
      // Rollback previous insertions
      await supabase
        .from('profile')
        .delete()
        .match({ profileid: profileid });
      await supabase
        .from('EducationAndTraining')
        .delete()
        .match({ educationid: educationData.educationid });
      throw healthError;
    }

    return { success: true, message: "Profile information successfully saved" };
  } catch (error: any) {
    console.error("Error saving profile:", error);
    return { 
      success: false, 
      message: "Failed to save profile information", 
      error: error.message 
    };
  }
}

