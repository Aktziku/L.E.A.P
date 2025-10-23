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
import { regions, provinces, city_mun, barangays } from 'phil-reg-prov-mun-brgy';





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
        region: '',
        zipcode: '',
        marital_status: '',
        religion: '',
        living_with: '',
        partner_occupation: '',
        family_income: '',
        current_year_level: '',
        highest_educational_attainment: '',
   });

   const [educationData, setEducationData] = useState<any>({
    elementary: '',
    juniorHigh: '',
    seniorHigh: '',
    college: '',
  });

  const [healthData, setHealthData] = useState<any>({
    pregnancy_status: '',
    medical_history: [],
    types_of_support: [],
    stage_of_pregnancy: ''
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
        region: profileData.region || '',
        zipcode: profileData.zipcode || '',
        marital_status: profileData.marital_status || '',
        religion: profileData.religion || '',
        living_with: profileData.living_with || '',
        partner_occupation: profileData.partner_occupation || '',
        family_income: profileData.family_income || '',
        current_year_level: profileData.current_year_level || '',
        highest_educational_attainment: profileData.highest_educational_attainment || ''
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
        types_of_support: healthData.types_of_support?.join(',') || '',
        stage_of_pregnancy: healthData.stage_of_pregnancy || ''
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
          region: '',
          province: '',
          zipcode: '',
          marital_status: '',
          religion: '',
          living_with: '',
          partner_occupation: '',
          family_income: '',
          current_year_level: '',
          highest_educational_attainment: '',
        });
        
        setEducationData({
          elementary: '',
          juniorHigh: '',
          seniorHigh: '',
          college: '',
        });
        
        setHealthData({
          stage_of_pregnancy: '',
          pregnancy_status: '',
          medical_history: [],
          types_of_support: [],

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
    if (["firstName", "lastName", "age", "birthdate", "contactnum", "barangay", "municipality",
          "province","region", "zipcode", "marital_status", "religion", "living_with","partner_occupation",
          "family_income","current_year_level","highest_educational_attainment",].includes(field)) {
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
    else if (field === "pregnancy_status") {
      setHealthData((prevData: any) => ({
        ...prevData,
        pregnancy_status: value
      }));
    }
    else if (field === "current_stage") {
      setHealthData((prevData: any) => ({
        ...prevData,
        stage_of_pregnancy: value
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

  const [regionlist, setRegionlist] = useState<any[]>(regions);
  const [provincelist, setProvincelist] = useState<any[]>([]);
  const [municipalitylist, setMunicipalitylist] = useState<any[]>([]);
  const [barangaylist, setBarangaylist] = useState<any[]>([]);

  const handleRegionChange = (regionCode: string) => {
    const filteredProvinces = provinces
      .filter((prov: { reg_code: string }) => prov.reg_code === regionCode);
     // console.log("Filtered Provinces:", filteredProvinces); 
      setProvincelist(filteredProvinces);
      setMunicipalitylist([]);
      setBarangaylist([]);

      const selectedRegion = regionlist.find((r: any) => r.reg_code === regionCode);
      handleChange("region", selectedRegion?.name || regionCode);
  };

  const handleProvinceChange = (provinceCode: string) => {
    const filteredMunicipalities = city_mun
    .filter((mun: { prov_code: string }) => mun.prov_code === provinceCode);
   // console.log("Filtered Municipalities:", filteredMunicipalities);
    setMunicipalitylist(filteredMunicipalities);
    setBarangaylist([]);

    const selectedProvince = provincelist.find((p: any) => p.prov_code === provinceCode);
    handleChange("province", selectedProvince?.name || provinceCode);
};

const handleMunicipalityChange = (municipalityCode: string) => {
  const filteredBarangays = barangays
  .filter((brgy: { mun_code: string }) => brgy.mun_code === municipalityCode);
 // console.log("Filtered Barangays:", filteredBarangays);
  setBarangaylist(filteredBarangays);

  const selectedMunicipality = municipalitylist.find((m: any) => m.mun_code === municipalityCode);
  handleChange("municipality", selectedMunicipality?.name || municipalityCode);
};

const handleBarangayChange = (barangayCode: string) => {
  //console.log("Selected Barangay:", barangayCode);
  const selectedBarangay = barangaylist.find((b: any) => b.brgy_code === barangayCode);
  handleChange("barangay", selectedBarangay?.name || barangayCode);
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
                {/* Marital Status */}
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent', }}>
                    <IonSelect
                        className='ion-margin'
                        label="Marital Status"
                        fill="outline"
                        labelPlacement="floating"
                        style={{"--color": "#000" }}
                        onIonChange={(e) => handleChange("marital_status", e.detail.value!)}
                    >
                      <IonSelectOption value="married">Married</IonSelectOption>
                      <IonSelectOption value="single">Single</IonSelectOption>
                      <IonSelectOption value="live-in">Common-law/Live-in</IonSelectOption>
                      <IonSelectOption value="separated">Separated</IonSelectOption>
                      <IonSelectOption value="widowed">Widowed</IonSelectOption>
                      <IonSelectOption value="divorced">Divorced</IonSelectOption>
                      <IonSelectOption value="annulled">Annulled</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                {/* Religion */}
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent', }}>
                    <IonSelect
                        className='ion-margin'
                        label="Religion"
                        fill="outline"
                        labelPlacement="floating"
                        style={{ "--color": "#000" }}
                        onIonChange={(e) => handleChange("religion", e.detail.value!)}
                    >
                      <IonSelectOption value="Catholic">Roman Catholic</IonSelectOption>
                      <IonSelectOption value="Evangelicals">Evangelicals</IonSelectOption>
                      <IonSelectOption value="Islam">Islam</IonSelectOption>
                      <IonSelectOption value="Iglesia Ni Cristo">Iglesia ni Cristo</IonSelectOption>
                      <IonSelectOption value="Others">Others Religious Affiliations</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>

                {/* Live With */}
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent', }}>
                    <IonSelect
                        className='ion-margin'
                        label="Live With"
                        fill="outline"
                        labelPlacement="floating"
                        style={{ "--color": "#000" }}
                        onIonChange={(e) => handleChange("living_with", e.detail.value!)}
                    >
                      <IonSelectOption value="Both Parents">Both Parents</IonSelectOption>
                      <IonSelectOption value="Mother">Mother</IonSelectOption>
                      <IonSelectOption value="Father">Father</IonSelectOption>
                      <IonSelectOption value="Relatives">Relatives</IonSelectOption>
                      <IonSelectOption value="Not living with Parents">Not living with Parents</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>    
              </IonRow>
                  
              <IonRow>
                {/*Partner Occupation */}
              <IonCol>
                <IonItem lines="none" style={{ "--background": "#fff","--color": "#000", '--background-hover':'transparent', }}>
                  <IonSelect
                          className='ion-margin'
                          label="Partner Occupation"
                          fill="outline"
                          labelPlacement="floating"
                          style={{ "--color": "#000" }}
                          onIonChange={(e) => handleChange("partner_occupation", e.detail.value!)}
                      >
                        <IonSelectOption value="Managers">Managers</IonSelectOption>
                        <IonSelectOption value="Professionals">Professionals</IonSelectOption>
                        <IonSelectOption value="Technicians and Associate Professionals ">Technicians and Associate Professionals </IonSelectOption>
                        <IonSelectOption value="Clerical Support Workers">Clerical Support Workers</IonSelectOption>
                        <IonSelectOption value="Skilled Agricultural, Forestry and Fishery Workers">Skilled Agricultural, Forestry and Fishery Workers</IonSelectOption>
                        <IonSelectOption value="Craft and Related Trades Workers">Craft and Related Trades Workers</IonSelectOption>
                        <IonSelectOption value="Plant and Machine Operators and Assemblers">Plant and Machine Operators and Assemblers</IonSelectOption>
                        <IonSelectOption value="Elementary Occupations">Elementary Occupations</IonSelectOption>
                        <IonSelectOption value="Armed Forces Occupations">Armed Forces Occupations</IonSelectOption>
                        <IonSelectOption value="Not Working">Not Working</IonSelectOption>
                      </IonSelect>
                </IonItem>
              </IonCol>

              {/*Family Income*/}
              <IonCol>
                <IonItem lines="none" style={{ "--background": "#fff","--color": "#000", '--background-hover':'transparent', }}>
                  <IonSelect
                          className='ion-margin'
                          label="Family Income"
                          fill="outline"
                          labelPlacement="floating"
                          style={{ "--color": "#000" }}
                          onIonChange={(e) => handleChange("family_income", e.detail.value!)}
                      >
                        <IonSelectOption value="Less than ₱10,000">Less than ₱10,000</IonSelectOption>
                        <IonSelectOption value="₱10,000 - ₱29,588">₱10,000 - ₱29,588</IonSelectOption>
                        <IonSelectOption value="₱29,589 - ₱39,999">₱29,589 - ₱39,999</IonSelectOption>
                        <IonSelectOption value="₱40,000 - ₱59,999">₱40,000 - ₱59,999</IonSelectOption>
                        <IonSelectOption value="₱60,000 - ₱99,999">₱60,000 - ₱99,999</IonSelectOption>
                        <IonSelectOption value="₱100,000 - ₱249,999">₱100,000 - ₱249,999</IonSelectOption>
                        <IonSelectOption value="₱250,000 - ₱499,999">₱250,000 - ₱499,999</IonSelectOption>
                        <IonSelectOption value="₱500,000 and Over">₱500,000 and Over</IonSelectOption>
                      </IonSelect>
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
                {/* REGION */}
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent',}}>
                    <IonSelect 
                        className='ion-margin'
                        label="Region" 
                        fill="outline" 
                        labelPlacement="floating" 
                        style={{ "--color": "#000", "--background-activated": "transparent" }}
                       onIonChange={(e) => handleRegionChange(e.detail.value)}>
                      {regionlist.map((r, index) => (
                        <IonSelectOption key={`reg-${r.reg_code}-${index}`} value={r.reg_code}>{r.name}</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                </IonCol>
                {/* PROVINCE */}
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent', }}>
                    <IonSelect 
                        className='ion-margin' 
                        label="Province" fill="outline" 
                        labelPlacement="floating" 
                        style={{ "--color": "#000" }}  
                        onIonChange={(e) => handleProvinceChange(e.detail.value)} disabled={provincelist.length === 0}>
                        {provincelist.map((p, index) => (
                          <IonSelectOption key={`prov-${p.prov_code}-${index}`} value={p.prov_code}>{p.name}</IonSelectOption>
                        ))}
                    </IonSelect>
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                {/* MUNICIPALITY */}
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent', }}>
                    <IonSelect 
                        className='ion-margin' 
                        label="Municipality" fill="outline" 
                        labelPlacement="floating" 
                        style={{ "--color": "#000" }} 
                        onIonChange={(e) => handleMunicipalityChange(e.detail.value)} disabled={municipalitylist.length === 0}>
                        {municipalitylist.map((m, index) => (
                          <IonSelectOption key={`mun-${m.mun_code}-${index}`} value={m.mun_code}>{m.name}</IonSelectOption>
                        ))}
                      </IonSelect>
                  </IonItem>
                </IonCol>

                {/* BARANGAY */}
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent',}}>
                     <IonSelect 
                        className='ion-margin' 
                        label="Barangay" 
                        fill="outline" 
                        labelPlacement="floating" 
                        style={{ "--color": "#000" }}
                        onIonChange={(e) => handleBarangayChange(e.detail.value)} disabled={barangaylist.length === 0}>
                        {barangaylist.map((b, index) => (
                          <IonSelectOption key={`${b.brgy_code}-${index}`} value={b.brgy_code}>{b.name}</IonSelectOption>
                        ))}
                      </IonSelect>
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                {/* Zip Code */}
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff" }}>
                    <IonInput
                        className='ion-margin'
                        label="Zip Code"
                        labelPlacement="floating"
                        fill="outline"
                        style={{ "--color": "#000" }}
                        onIonChange={(e) =>
                            handleChange("zipcode", e.detail.value!)
                        }
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
                    Educational Background
                </IonItemDivider>

                <IonRow>
                    <IonCol>
                        <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent', }}>
                          <IonSelect
                              className='ion-margin'
                              label="Type Of School Attended"
                              fill="outline"
                              labelPlacement="floating"
                              style={{"--color": "#000" }}
                              onIonChange={(e) => handleChange("type_of_school", e.detail.value!)}
                          >
                            <IonSelectOption value="Private">Private</IonSelectOption>
                            <IonSelectOption value="Public">Public</IonSelectOption>
                          </IonSelect>
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent', }}>
                        <IonSelect
                              className='ion-margin'
                              label="Current Year Level Of Education"
                              fill="outline"
                              labelPlacement="floating"
                              style={{"--color": "#000" }}
                              onIonChange={(e) => handleChange("current_year_level", e.detail.value!)}
                          >
                            <IonSelectOption value="Grade 1">Grade 1</IonSelectOption>
                            <IonSelectOption value="Grade 2">Grade 2</IonSelectOption>
                            <IonSelectOption value="Grade 3">Grade 3</IonSelectOption>
                            <IonSelectOption value="Grade 4">Grade 4</IonSelectOption>
                            <IonSelectOption value="Grade 5">Grade 5</IonSelectOption>
                            <IonSelectOption value="Grade 6">Grade 6</IonSelectOption>
                            <IonSelectOption value="Grade 7">Grade 7</IonSelectOption>
                            <IonSelectOption value="Grade 8">Grade 8</IonSelectOption>
                            <IonSelectOption value="Grade 9">Grade 9</IonSelectOption>
                            <IonSelectOption value="Grade 10">Grade 10</IonSelectOption>
                            <IonSelectOption value="Grade 11">Grade 11</IonSelectOption>
                            <IonSelectOption value="Grade 12">Grade 12</IonSelectOption>
                            <IonSelectOption value="1st Year College">1st Year College</IonSelectOption>
                            <IonSelectOption value="2nd Year College">2nd Year College</IonSelectOption>
                            <IonSelectOption value="3rd Year College">3rd Year College</IonSelectOption>
                            <IonSelectOption value="4th Year College">4th Year College</IonSelectOption>
                            <IonSelectOption value="Vocational Training">Vocational Training</IonSelectOption>
                            <IonSelectOption value="ALS Elementary">ALS Elementary</IonSelectOption>
                            <IonSelectOption value="ALS Secondary">ALS Secondary</IonSelectOption>
                          </IonSelect>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                     <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent', }}>
                        <IonSelect
                              className='ion-margin'
                              label="Highest Educational Attainment"
                              fill="outline"
                              labelPlacement="floating"
                              style={{"--color": "#000" }}
                              onIonChange={(e) => handleChange("highest_educational_attainment", e.detail.value!)}
                          >
                            <IonSelectOption value="Grade 1">Grade 1</IonSelectOption>
                            <IonSelectOption value="Grade 2">Grade 2</IonSelectOption>
                            <IonSelectOption value="Grade 3">Grade 3</IonSelectOption>
                            <IonSelectOption value="Grade 4">Grade 4</IonSelectOption>
                            <IonSelectOption value="Grade 5">Grade 5</IonSelectOption>
                            <IonSelectOption value="Grade 6">Grade 6</IonSelectOption>
                            <IonSelectOption value="Grade 7">Grade 7</IonSelectOption>
                            <IonSelectOption value="Grade 8">Grade 8</IonSelectOption>
                            <IonSelectOption value="Grade 9">Grade 9</IonSelectOption>
                            <IonSelectOption value="Grade 10">Grade 10</IonSelectOption>
                            <IonSelectOption value="Grade 11">Grade 11</IonSelectOption>
                            <IonSelectOption value="Grade 12">Grade 12</IonSelectOption>
                            <IonSelectOption value="1st Year College">1st Year College</IonSelectOption>
                            <IonSelectOption value="2nd Year College">2nd Year College</IonSelectOption>
                            <IonSelectOption value="3rd Year College">3rd Year College</IonSelectOption>
                            <IonSelectOption value="4th Year College">4th Year College</IonSelectOption>
                            <IonSelectOption value="Vocational Training">Vocational Training</IonSelectOption>
                            <IonSelectOption value="ALS Elementary">ALS Elementary</IonSelectOption>
                            <IonSelectOption value="ALS Secondary">ALS Secondary</IonSelectOption>
                          </IonSelect>
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
                  <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent', }}>
                    <IonSelect
                        className='ion-margin'
                        label="Stage of Pregnancy"
                        fill="outline"
                        labelPlacement="floating"
                        style={{"--color": "#000" }}
                        onIonChange={(e) => handleChange("stage_of_pregnancy", e.detail.value!)}
                    >
                      <IonSelectOption value="First Trimester">First Trimester</IonSelectOption>
                      <IonSelectOption value="Second Trimester">Second Trimester</IonSelectOption>
                      <IonSelectOption value="Third Trimester">Third Trimester</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonItem lines="none" style={{ "--background": "#fff",fontWeight: "bold", fontSize: "0.9rem" }}>
                <IonLabel style={{ color: "#000" }}>Medical History</IonLabel>
              </IonItem>
              <IonRow>
                {["Anemia", "Depression", "Hypertension", "Others"].map((cond) => (
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