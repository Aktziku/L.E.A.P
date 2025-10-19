import {
    IonModal,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonCardHeader,
    IonCardTitle,
    useIonActionSheet,
    IonRow,
    IonCol,
    IonGrid,
    IonItemGroup,
    IonItemDivider,
    IonCheckbox
} from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../utils/supabaseClients';
import {saveCompleteProfile} from '../services/profileService';


interface AddProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (profile: any) => Promise<void>;
}

const AddProfileModal: React.FC<AddProfileModalProps> = ({ isOpen, onClose, onSave }) => {
   const [isEditing, setIsEditing] = useState(false);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [profileData, setProfileData] = useState<any>({
        firstName: '',  
        lastName: '',   
        age: 0,
        birthdate: '',
        contactnum: '',
        barangay: '',
        municipality: '',
        province: '',
        zipcode: '',
   });

   const [educationData, setEducationData] = useState<any>({
    elementary: '',
    juniorHigh: '',
    seniorHigh: '',
    college: '',
  });

  const [healthData, setHealthData] = useState<any>({
    pregnancy_Status: '',
    medical_history: [],
    support_needs: [],
  });

  // Function to save profile data to Supabase
  const saveProfileToSupabase = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user ID from current session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No user logged in');
      }
      
      // Generate IDs for the different tables
      const profileId = Math.floor(Math.random() * 1000000);
      const educationId = Math.floor(Math.random() * 1000000);
      const healthid = parseInt(user.id, 10) || Math.floor(Math.random() * 1000000);
      
      // Prepare data for Supabase
      // Debug the current profileData
      console.log("Current profileData:", profileData);
      
      const profilePayload = {
        profileid: profileId,
        // Use lowercase column names for Supabase
        firstName: profileData.firstName || profileData.firstname || '',
        lastName: profileData.lastName || profileData.lastname || '',
        age: profileData.age || 0,
        birthdate: profileData.birthdate || '',
        contactnum: profileData.contactnum || '',
        barangay: profileData.barangay || '',
        municipality: profileData.municipality || '',
        province: profileData.province || '',
        zipcode: profileData.zipcode || '',
      };
      
      const educationPayload = {
        educationid: educationId,
        profileid: profileId,
        elementary: educationData.elementary || '',
        juniorHigh: educationData.juniorHigh || '',
        seniorHigh: educationData.seniorHigh || '',
        college: educationData.college || '',
      };
      
      const healthPayload = {
        health_id: healthid,
        profileid: profileId,
        pregnancy_status: healthData.pregnancy_status || '',
        medical_history: healthData.medical_history?.join(',') || '',
        support_type: healthData.support_type?.join(',') || '',
      };
      
      // Save the profile using the service function
      const result = await saveCompleteProfile(
        profilePayload,
        educationPayload,
        healthPayload
      );
      
      if (result.success) {
        // Call onSave prop with the complete data
        await onSave({
          ...profilePayload,
          education: educationPayload,
          health: healthPayload
        });
        
        // Reset form fields
        setProfileData({
          firstName: '',  
          lastName: '',
          age: 0,
          birthdate: '',
          contactnum: '',
          barangay: '',
          municipality: '',
          province: '',
          zipcode: '',
        });
        
        setEducationData({
          elementary: '',
          juniorHigh: '',
          seniorHigh: '',
          college: '',
        });
        
        setHealthData({
          pregnancy_Status: '',
          medical_history: [],
          support_needs: [],
          current_stage: ''
        });
        
        onClose();
      } else {
        setError(result.message || 'An error occurred while saving the profile');
      }
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || 'An error occurred while saving the profile');
      
      // Display Supabase error details if available
      if (err?.error_description) {
        console.error('Supabase error details:', err.error_description);
        setError(`${err.message}: ${err.error_description}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    // Map field names to match the database column names
    const fieldNameMapping: Record<string, string> = {
      firstName: "firstName", 
      lastName: "lastName"   
    };

    // Profile data fields
    if (["firstName", "lastName", "age", "birthdate", "contactnum", "barangay", "municipality", "province", "zipcode"].includes(field)) {
      setProfileData((prevData: any) => ({
        ...prevData,
        [fieldNameMapping[field] || field]: field === "age" ? Number(value) : value
      }));
    }
    
    // Education data fields
    else if (["elementary", "juniorHigh", "seniorHigh", "college"].includes(field)) {
      setEducationData((prevData: any) => ({
        ...prevData,
        [field]: value
      }));
    }
    
    // Health data fields
    else if (field === "pregnancy_Status") {
      setHealthData((prevData: any) => ({
        ...prevData,
        pregnancy_Status: value
      }));
    }
    else if (field === "current_stage") {
      setHealthData((prevData: any) => ({
        ...prevData,
        current_stage: value
      }));
    }
    // For checkboxes (medical history and support needs)
    else if (field.startsWith("medical_")) {
      const condition = field.replace("medical_", "");
      setHealthData((prevData: any) => {
        const updatedMedicalHistory = value 
          ? [...prevData.medical_history, condition] 
          : prevData.medical_history.filter((item: string) => item !== condition);
        
        return {
          ...prevData,
          medical_history: updatedMedicalHistory
        };
      });
    }
    else if (field.startsWith("support_")) {
      const support = field.replace("support_", "");
      setHealthData((prevData: any) => {
        const updatedSupportNeeds = value 
          ? [...prevData.support_needs, support] 
          : prevData.support_needs.filter((item: string) => item !== support);
        
        return {
          ...prevData,
          support_needs: updatedSupportNeeds
        };
      });
    }
  };



    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} style={{'--width':'100%','--height':'100%',}} >
            <IonHeader>
                <IonToolbar
                    style={{
                        '--background': '#002d54',
                        color: '#fff',
                    }}
                >
                    <IonTitle
                        style={{
                            fontWeight: 'bold',
                        }}
                    >
                        {isEditing ? 'Edit Profile' : 'Add Profile'}
                    </IonTitle>

                    {/* Close button */}
                    <IonButton
                        slot="end" 
                        onClick={onClose}
                        style={{
                            '--background': '#fff',
                            '--color': '#000000ff',
                            borderRadius: '8px',
                            marginRight: '10px',
                            fontWeight: 'bold',
                        }}
                    >
                        Close
                     </IonButton>

                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding" style={{ "--background": "#fff" }}>
        <IonCard style={{ borderRadius: "15px", boxShadow: "0 0 10px #ccc", "--background": "#fff" }}>
          <IonCardContent>
            <h2 style={{ color: "black", fontWeight: "bold", backgroundColor: '#fff', padding: '10px', fontSize: '2rem' }}>Registration</h2>

            {/* BASIC INFORMATION */}
            <IonItemGroup>
              <IonItemDivider
                style={{
                  "--color": "#000",
                  fontWeight: "bold",
                  "--background": "#fff",
                }}
              >
                Basic Information
              </IonItemDivider>

              <IonRow>
                {/* First Name */}
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff" }}>
                    <IonInput
                        className='ion-margin'
                        label="First Name"
                        labelPlacement="floating"
                        fill="outline"
                        style={{ "--color": "#000" }}
                        onIonChange={(e) =>
                            handleChange("firstName", e.detail.value!)
                        }
                    />
                  </IonItem>
                </IonCol>
                {/* Last Name */}
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff" }}>
                    <IonInput
                        className='ion-margin'
                        label="Last Name"
                        labelPlacement="floating"
                        fill="outline"
                        style={{ "--color": "#000" }}
                        onIonChange={(e) =>
                            handleChange("lastName", e.detail.value!)
                        }
                    />
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                {/* Age */}
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff" }}>
                    <IonInput
                        className='ion-margin'
                        label="Age"
                        type="number"
                        labelPlacement="floating"
                        fill="outline"
                        style={{ "--color": "#000" }}
                        onIonChange={(e) => handleChange("age", e.detail.value!)}
                    />
                  </IonItem>
                </IonCol>

                {/* Date of Birth */}
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff" }}>
                    <IonInput
                        className='ion-margin'
                        label="Date of Birth"
                        type="date"
                        labelPlacement="floating"
                        fill="outline"
                        style={{ "--color": "#000" }}
                        onIonChange={(e) =>
                            handleChange("birthdate", e.detail.value!)
                        }
                    />
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                {/* contact number */}
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff" }}>
                    <IonInput
                        className='ion-margin'
                        label="Contact Number"
                        labelPlacement="floating"
                        fill="outline"
                        style={{ "--color": "#000" }}
                        onIonChange={(e) =>
                            handleChange("contactnum", e.detail.value!)
                        }
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonItemGroup>

            {/* ADDRESS */}
            <IonItemGroup>
              <IonItemDivider
                style={{
                  "--color": "#000",
                  fontWeight: "bold",
                  "--background": "#fff",
                }}
              >
                Address
              </IonItemDivider>

              <IonRow>
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff" }}>
                    <IonInput
                        className='ion-margin'
                        label="Barangay"
                        fill="outline"
                        labelPlacement="floating"
                        style={{ "--color": "#000" }}
                        onIonChange={(e) => handleChange("barangay", e.detail.value!)}
                    />
                  </IonItem>
                </IonCol>
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff" }}>
                    <IonInput
                        className='ion-margin'
                        label="Municipality/City"
                        fill="outline"
                        labelPlacement="floating"
                        style={{ "--color": "#000" }}
                        onIonChange={(e) => handleChange("municipality", e.detail.value!)}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff" }}>
                    <IonInput
                        className='ion-margin'
                        label="Province"
                        fill="outline"
                        labelPlacement="floating"
                        style={{ "--color": "#000" }}
                        onIonChange={(e) => handleChange("province", e.detail.value!)}
                    />
                  </IonItem>
                </IonCol>
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff" }}>
                    <IonInput
                        className='ion-margin'
                        label="Zip Code"
                        fill="outline"
                        labelPlacement="floating"
                        style={{ "--color": "#000" }}
                        onIonChange={(e) => handleChange("zipcode", e.detail.value!)}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonItemGroup>

            {/* Educational Background */}
            <IonItemGroup>
                <IonItemDivider
                    style={{
                    "--color": "#000",
                    fontWeight: "bold",
                    "--background": "#fff",
                    }}
                >
                    School Background
                </IonItemDivider>

                <IonRow>
                    <IonCol>
                        <IonItem lines="none" style={{ "--background": "#fff" }}>
                        <IonInput
                            className='ion-margin'
                            label="Elementary School"
                            fill="outline"
                            labelPlacement="floating"
                            style={{ "--color": "#000" }}
                            onIonChange={(e) => handleChange("elementary", e.detail.value!)}
                        />
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonItem lines="none" style={{ "--background": "#fff" }}>
                        <IonInput
                            className='ion-margin'
                            label="Junior High School"
                            fill="outline"
                            labelPlacement="floating"
                            style={{ "--color": "#000" }}
                            onIonChange={(e) => handleChange("juniorHigh", e.detail.value!)}
                        />
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem lines="none" style={{ "--background": "#fff" }}>
                        <IonInput
                            className='ion-margin'
                            label="Senior High School"
                            fill="outline"
                            labelPlacement="floating"
                            style={{ "--color": "#000" }}
                            onIonChange={(e) => handleChange("seniorHigh", e.detail.value!)}
                        />
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonItem lines="none" style={{ "--background": "#fff" }}>
                        <IonInput
                            className='ion-margin'
                            label="College"
                            fill="outline"
                            labelPlacement="floating"
                            style={{ "--color": "#000" }}
                            onIonChange={(e) => handleChange("college", e.detail.value!)}
                        />
                        </IonItem>
                    </IonCol>
                </IonRow>
            </IonItemGroup>

            {/* HEALTH STATUS */}
            <IonItemGroup>
              <IonItemDivider
                style={{
                  "--color": "#000",
                  fontWeight: "bold",
                  "--background": "#fff",
                }}
              >
                Health Status
              </IonItemDivider>

              <IonRow>
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent', }}>
                    <IonSelect
                        className='ion-margin'
                        label="Pregnancy Status"
                        fill="outline"
                        labelPlacement="floating"
                        style={{"--color": "#000" }}
                        onIonChange={(e) => handleChange("pregnancy_status", e.detail.value!)}
                    >
                      <IonSelectOption value="pregnant">Pregnant</IonSelectOption>
                      <IonSelectOption value="not_pregnant">Not Pregnant</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff" }}>
                    <IonInput
                        className='ion-margin'
                        label="Current Stage"
                        fill="outline"
                        labelPlacement="floating"
                        style={{ "color": "#000" }}
                        onIonChange={(e) => handleChange("current_stage", e.detail.value!)}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonItem lines="none" style={{ "--background": "#fff",fontWeight: "bold", fontSize: "0.9rem" }}>
                <IonLabel style={{ color: "#000" }}>Medical History</IonLabel>
              </IonItem>
              <IonRow>
                {["Anemia", "Depression", "Hypertension"].map((cond) => (
                  <IonCol size="6" key={cond}>
                    <IonItem lines="none" style={{ "--background": "#fff", '--background-hover':'transparent', }}>
                      <IonCheckbox 
                        labelPlacement="end" 
                         style={{ '--checkbox-background': '#ffffffff',
                                  '--checkbox-background-checked': '#ffffffff',
                                  '--border-color': '#000000ff',
                                  '--checkbox-icon-color': '#ffffff'
                                }}
                        onIonChange={(e) => handleChange(`medical_${cond}`, e.detail.checked)}
                      >
                        <IonLabel style={{ color: "#000" }}>{cond}</IonLabel>
                      </IonCheckbox>
                    </IonItem>
                  </IonCol>
                ))}
                <IonCol>
                    <IonItem  lines="none" style={{ "--background": "#fff",'--background-hover':'transparent',  }}>
                      <IonCheckbox 
                        labelPlacement="end" 
                         style={{ '--checkbox-background': '#ffffffff',
                                  '--checkbox-background-checked': '#ffffffff',
                                  '--border-color': '#000000ff',
                                  '--checkbox-icon-color': '#ffffff'
                                }}
                        onIonChange={(e) => handleChange("medical_Others", e.detail.checked)}
                      >
                        <IonLabel style={{ color: "#000" }}>Others</IonLabel>
                      </IonCheckbox>
                    </IonItem>
                  </IonCol>
              </IonRow>
            </IonItemGroup>

            {/* SOCIAL SUPPORT NEEDS */}
            <IonItemGroup>
              <IonItemDivider
                style={{
                  "--color": "#000",
                  fontWeight: "bold",
                  "--background": "#fff",
                }}
              >
                Social Support Needs
              </IonItemDivider>

              <IonRow>
                {["Financial Aid", "Counseling", "Health Support", "Livelihood Training"].map(
                  (support) => (
                    <IonCol size="6" key={support}>
                      <IonItem lines="none" style={{ "--background": "#fff",'--background-hover':'transparent',  }}>
                        <IonCheckbox 
                          labelPlacement="end"
                          style={{ '--checkbox-background': '#ffffffff',
                                  '--checkbox-background-checked': '#ffffffff',
                                  '--border-color': '#000000ff',
                                  '--checkbox-icon-color': '#ffffff'
                                }}
                          onIonChange={(e) => handleChange(`support_${support}`, e.detail.checked)}
                        >
                          <IonLabel style={{ color: "#000" }}>{support}</IonLabel>
                        </IonCheckbox>
                      </IonItem>
                    </IonCol>
                  )
                )}
              </IonRow>
            </IonItemGroup>

            <IonRow className="ion-justify-content-center ion-margin-top">
              <IonCol size="auto">
                <IonButton 
                  color="primary" 
                  onClick={saveProfileToSupabase}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </IonButton>
              </IonCol>
              <IonCol size="auto">
                <IonButton color="medium" fill="outline" onClick={onClose} disabled={loading}>
                  Cancel
                </IonButton>
              </IonCol>
            </IonRow>
            
            {error && (
              <IonRow>
                <IonCol>
                  <div style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
                    {error}
                  </div>
                </IonCol>
              </IonRow>
            )}
          </IonCardContent>
        </IonCard>
            </IonContent>
        </IonModal>
    );
};

export default AddProfileModal;