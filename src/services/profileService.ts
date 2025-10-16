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
  elementary: string;
  juniorHigh: string;
  seniorHigh: string;
  college: string;
}

interface MaternalHealthData {
    health_id: number;
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
      .insert([profileData]);

    if (profileError) throw profileError;

    //Insert into EducationAndTraining table
    const { data: educationResult, error: educationError } = await supabase
      .from('EducationAndTraining')
      .insert([educationData]);

    if (educationError) {
      // Rollback profile insertion
      await supabase
        .from('profile')
        .delete()
        .match({ profileid: profileData.profileid });
      throw educationError;
    }

    // 3. Insert into maternalhealthRecord table
    const { data: healthResult, error: healthError } = await supabase
      .from('maternalhealthRecord')
      .insert([maternalHealthData]);

    if (healthError) {
      // Rollback previous insertions
      await supabase
        .from('profile')
        .delete()
        .match({ profileid: profileData.profileid });
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

