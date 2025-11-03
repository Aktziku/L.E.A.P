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
    IonCheckbox,
    IonRadio,
    IonRadioGroup
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
   const [isIndigenous, setIsIndigenous] = useState<string>(''); 

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
        family_income: '',
        current_year_level: '',
        highest_educational_attainment: '',
        fathers_occupation: '',
        mothers_occupation: '',
        indigenous_ethnicity: '',
   });

   const [partnersData, setPartnersData] = useState<any>({
    pFirstname: '',
    pLastname: '',
    pAge: 0,
    pBirthdate: '',
    pOccupation: '',
    pIncome: '',
   });


  const [healthData, setHealthData] = useState<any>({
    pregnancy_status: '',
    medical_history: [],
    types_of_support: [],
    stage_of_pregnancy: '',
    medical_history_others: '',
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
      const currentYear = new Date().getFullYear();
      const yearPrefix = parseInt( currentYear.toString());

      const {data: latestProfile, error: fetchError} = await supabase
        .from('profile')
        .select('profileid')
        .gte('profileid', yearPrefix * 10000)
        .lt('profileid',(yearPrefix + 1) * 10000)
        .order('profileid', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      let profileId: number;
      if (latestProfile && latestProfile.profileid) {
        profileId = latestProfile.profileid + 1;
      } else {
        profileId = yearPrefix * 10000 + 1;
      }

      const partnerid = profileId;
      const healthid = profileId;
      
      // Prepare data for Supabase
      // Debug the current profileData
      console.log("Current profileData:", profileData);
      
      const profilePayload = {
        profileid: profileId,
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
        family_income: profileData.family_income || '',
        current_year_level: profileData.current_year_level || '',
        highest_educational_attainment: profileData.highest_educational_attainment || '',
        fathers_occupation: profileData.fathers_occupation || '',
        mothers_occupation: profileData.mothers_occupation || '',
        indigenous_ethnicity: profileData.indigenous_ethnicity || '',
      };

      const partnersPayload = {
        partnerid: partnerid,
        profileid: profileId,
        pFirstname: partnersData.pFirstname || '',
        pLastname: partnersData.pLastname || '',
        pAge: partnersData.pAge || 0,
        pBirthdate: partnersData.pBirthdate || '',
        pOccupation: partnersData.pOccupation || '',
        pIncome: partnersData.pIncome || '',
      };
      
      
      const healthPayload = {
        health_id: healthid,
        profileid: profileId,
        pregnancy_status: healthData.pregnancy_status || '',
        medical_history: [
          ...healthData.medical_history,
          ...(healthData.medical_history_others ? [` ${healthData.medical_history_others}`] : [])
        ].join(',') || '',
        types_of_support: healthData.types_of_support?.join(',') || '',
        stage_of_pregnancy: healthData.stage_of_pregnancy || '',
      };
      
      // Save the profile using the service function
      const result = await saveCompleteProfile(
        profilePayload,
        healthPayload,
        partnersPayload
      );
      
      if (result.success) {
        // Call onSave prop with the complete data
        await onSave({
          ...profilePayload,
          partner: partnersPayload,
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
          fathers_occupation: '',
          mothers_occupation: '',
          indigenous_ethnicity: '',
        });

        setPartnersData({
          pFirstname: '',
          pLastname: '',
          pAge: 0,
          pBirthdate: '',
          pOccupation: '',
          pIncome: '',
        });
        
        setHealthData({
          stage_of_pregnancy: '',
          pregnancy_status: '',
          medical_history: [],
          types_of_support: [],
          medical_history_others: '',

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
          "family_income","current_year_level","highest_educational_attainment","fathers_occupation",
          "mothers_occupation", "indigenous_ethnicity"].includes(field)) {
      setProfileData((prevData: any) => ({
        ...prevData,
        [fieldNameMapping[field] || field]: field === "age" ? Number(value) : value
      }));
    }

    // Partner data fields
    else if (["pFirstname", "pLastname", "pAge", "pBirthdate", "pOccupation", "pIncome"].includes(field)) {
      setPartnersData((prevData: any) => ({
        ...prevData,
        [fieldNameMapping[field] || field]: field === "pAge" ? Number(value) : value
      }));
    }
    
    // Health data fields
    else if (field === "pregnancy_status") {
      setHealthData((prevData: any) => ({
        ...prevData,
        pregnancy_status: value
      }));
    }
    else if (field === "stage_of_pregnancy") {
      setHealthData((prevData: any) => ({
        ...prevData,
        stage_of_pregnancy: value
      }));
    }
    else if (field === "medical_history_others") {
      setHealthData((prevData: any) => ({
        ...prevData,
        medical_history_others: value
      }));
    }
    // For checkboxes (medical history and support needs)
    else if (field.startsWith("medical_")) {
      const condition = field.replace("medical_", "");
      setHealthData((prevData: any) => {
       const currentHistory = prevData.medical_history || [];
        const updatedMedicalHistory = value 
          ? [...currentHistory, condition] 
          : currentHistory.filter((item: string) => item !== condition);
        
        return {
          ...prevData,
          medical_history: updatedMedicalHistory
        };
      });
    }
    else if (field.startsWith("support_")) {
      const support = field.replace("support_", "");
      setHealthData((prevData: any) => {
        const currentSupport = prevData.types_of_support || [];
        const updatedSupportNeeds = value 
          ? [...currentSupport, support] 
          : currentSupport.filter((item: string) => item !== support);
        
        return {
          ...prevData,
          types_of_support: updatedSupportNeeds
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

const Occupations = [
    "Managers", "Professionals", "Technicians and Associate Professionals", "Clerical Support Workers", "Service Workers",
    "Skilled Agricultural, Forestry and Fishery Workers", "Craft and Related Trades Workers", "Plant and Machine Operators and Assemblers",
    "Elementary Occupations", "Armed Forces Occupations", "Not Working"
];

const Income = [
    "None", "Less than ₱10,000", "₱10,000 - ₱29,588", "₱29,589 - ₱39,999", "₱40,000 - ₱59,999",
    "₱60,000 - ₱99,999", "₱100,000 - ₱249,999", "₱250,000 - ₱499,999", "₱500,000 and Over"
];

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
              <h2 style={{ color: "black", fontWeight: "bold", backgroundColor: '#fff', padding: '10px', fontSize: '2rem', textAlign: 'center' }}>
                Registration Form
              </h2>

            {/* BASIC INFORMATION */}
            <IonItemGroup>
              <IonItemDivider
                style={{
                  "--color": "#000",
                  fontWeight: "bold",
                  "--background": "#fff",
                }}
              >
                Teenage Basic Information
              </IonItemDivider>
                <IonGrid>
                  <IonRow>
                    {/* First Name */}
                    <IonCol size='12' size-md='6'>
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
                    <IonCol size='12' size-md='6'>
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
                </IonGrid>

                <IonGrid>
                  <IonRow>
                    {/* Age */}
                    <IonCol size='12' size-md='6'>
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
                    <IonCol size='12' size-md='6'>
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
                </IonGrid>

                <IonGrid>
                  <IonRow>
                    {/* contact number */}
                    <IonCol size='12' size-md='6'>
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
                    <IonCol size='12' size-md='6'>
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
                </IonGrid>

                <IonGrid>
                  <IonRow>
                    {/* Religion */}
                    <IonCol size='12' size-md='6'>
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
                    <IonCol size='12' size-md='6'>
                      <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent', }}>
                        <IonSelect
                            className='ion-margin'
                            label="Live With"
                            fill="outline"
                            labelPlacement="floating"
                            style={{ "--color": "#000" }}
                            onIonChange={(e) => handleChange("living_with", e.detail.value!)}
                        >
                          <IonSelectOption value="Living with Both Parents">Both Parents</IonSelectOption>
                          <IonSelectOption value="Living with Mother">Mother</IonSelectOption>
                          <IonSelectOption value="Living with Father">Father</IonSelectOption>
                          <IonSelectOption value="Living with Relatives">Relatives</IonSelectOption>
                          <IonSelectOption value="Living with Partners">Partner</IonSelectOption>
                          <IonSelectOption value="Not living with Parents">Not living with Parents</IonSelectOption>
                        </IonSelect>
                      </IonItem>
                    </IonCol>    
                  </IonRow>
                </IonGrid>

                <IonGrid>
                  <IonRow>
                  {/*Indigenous Ethnicity */}
                         <IonLabel style={{ fontWeight: 'bold', color: '#000', }}>
                          Member of Indigenous People?
                        </IonLabel>
                    <IonCol >
                      <IonItem lines="none" style={{"--background": "#fff","--color": "#000","--background-hover": "transparent",}}>

                        <IonRadioGroup
                          value={isIndigenous}
                          onIonChange={(e) => {
                            setIsIndigenous(e.detail.value);
                            if (e.detail.value === "No") {
                              handleChange("is_indigenous", "");
                            }
                          }}
                          style={{
                            display: "flex",
                            gap: "1rem",
                            marginTop: "0.5rem",
                          }}
                        >
                          <IonCol size='12' size-md='6'>
                            <IonItem lines="none" style={{ "--background": "transparent" }}>
                              <IonLabel>Yes</IonLabel>
                              <IonRadio slot="start" value="Yes" />
                            </IonItem>
                          </IonCol>

                          <IonCol size='12' size-md='6'>
                            <IonItem lines="none" style={{ "--background": "transparent" }}>
                              <IonLabel>No</IonLabel>
                              <IonRadio slot="start" value="No" />
                            </IonItem>
                          </IonCol>
                        </IonRadioGroup>
                      </IonItem>
                    </IonCol>
                    
                    <IonCol size='12' size-md='6'>
                        <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent', }}>
                          <IonInput
                            className='ion-margin'
                            label="Specify Indigenous People"
                            type="text"
                            labelPlacement="floating"
                            fill="outline"
                            style={{ "--color": "#000" }}
                            onIonChange={(e) =>
                              handleChange("indigenous_ethnicity", e.detail.value!)
                            }
                            disabled={isIndigenous !== 'Yes'}
                          />
                        </IonItem>
                    </IonCol>
                  </IonRow>
                </IonGrid>

                <IonGrid>
                  <IonRow>
                  {/*Fathers Occupation*/}
                  <IonCol size='12' size-md='6'>
                    <IonItem lines="none" style={{ "--background": "#fff","--color": "#000", '--background-hover':'transparent', }}>
                      <IonSelect
                              className='ion-margin'
                              label="Fathers Occupation"
                              fill="outline"
                              labelPlacement="floating"
                              style={{ "--color": "#000" }}
                              onIonChange={(e) => handleChange("fathers_occupation", e.detail.value!)}
                          >
                            {Occupations.map((occupation, index) => (
                              <IonSelectOption key={index} value={occupation}>{occupation}</IonSelectOption>
                            ))}
                          </IonSelect>
                    </IonItem>
                  </IonCol>

                  {/*Mothers Occupation*/}
                  <IonCol size='12' size-md='6'>
                    <IonItem lines="none" style={{ "--background": "#fff","--color": "#000", '--background-hover':'transparent', }}>
                      <IonSelect
                              className='ion-margin'
                              label="Mothers Occupation"
                              fill="outline"
                              labelPlacement="floating"
                              style={{ "--color": "#000" }}
                              onIonChange={(e) => handleChange("mothers_occupation", e.detail.value!)}
                          >
                            {Occupations.map((occupation, index) => (
                              <IonSelectOption key={index} value={occupation}>{occupation}</IonSelectOption>
                            ))}
                          </IonSelect>
                    </IonItem>
                  </IonCol>
                  </IonRow>
                </IonGrid>

                <IonGrid>
                  <IonRow>
                  {/*Family Income*/}
                  <IonCol size='12' size-md='6'>
                    <IonItem lines="none" style={{ "--background": "#fff","--color": "#000", '--background-hover':'transparent', }}>
                      <IonSelect
                              className='ion-margin'
                              label="Family Income"
                              fill="outline"
                              labelPlacement="floating"
                              style={{ "--color": "#000" }}
                              onIonChange={(e) => handleChange("family_income", e.detail.value!)}
                          >
                            {Income.map((incomeRange, index) => (
                              <IonSelectOption key={index} value={incomeRange}>{incomeRange}</IonSelectOption>
                            ))}
                          </IonSelect>
                    </IonItem>
                  </IonCol>
                  </IonRow>
                </IonGrid>
            </IonItemGroup>

            {/*PARTNER INFORMATION */}
            <IonItemGroup>
              <IonItemDivider
                style={{
                  "--color": "#000",
                  fontWeight: "bold",
                  "--background": "#fff",
                }}
              >
                Partner`s Information
              </IonItemDivider>

              <IonGrid>
                <IonRow>
                  {/* Partner's First Name */}
                  <IonCol size='12' size-md='6'>
                    <IonItem lines="none" style={{ "--background": "#fff", }}>
                      <IonInput
                        className='ion-margin'
                        type="text" 
                        label="Partner's First Name"
                        labelPlacement="floating"
                        fill='outline'
                        style={{ "--color": "#000" }}
                        onIonChange={(e) => handleChange("pFirstname", e.detail.value!)}
                      />
                    </IonItem>
                  </IonCol>
                  {/* Partner's Last Name */}
                  <IonCol size='12' size-md='6'>
                    <IonItem lines="none" style={{ "--background": "#fff", }}>
                      <IonInput
                        className='ion-margin'
                        type="text" 
                        label="Partner's Last Name"
                        labelPlacement="floating"
                        fill='outline'
                        style={{ "--color": "#000" }}
                        onIonChange={(e) => handleChange("pLastname", e.detail.value!)}
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>

              <IonGrid>
                <IonRow>
                  {/* Partner's Age */}
                  <IonCol size='12' size-md='6'>
                    <IonItem lines="none" style={{ "--background": "#fff","--color": "#000", '--background-hover':'transparent', }}>
                      <IonInput
                        className='ion-margin'
                        type="number" 
                        label="Partner's Age"
                        fill='outline'
                        labelPlacement="floating"
                        style={{ "--color": "#000" }}
                        onIonChange={(e) => handleChange("pAge", e.detail.value!)}
                      />
                    </IonItem>
                  </IonCol>
                  {/* Date of Birth */}
                  <IonCol size='12' size-md='6'>
                    <IonItem lines="none" style={{ "--background": "#fff" }}>
                      <IonInput
                          className='ion-margin'
                          label="Date of Birth"
                          type="date"
                          labelPlacement="floating"
                          fill="outline"
                          style={{ "--color": "#000" }}
                          onIonChange={(e) =>
                              handleChange("pBirthdate", e.detail.value!)
                          }
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>

              <IonGrid>
                <IonRow>
                {/*Partner Occupation */}
                <IonCol size='12' size-md='6'>
                  <IonItem lines="none" style={{ "--background": "#fff","--color": "#000", '--background-hover':'transparent', }}>
                    <IonSelect
                            className='ion-margin'
                            label="Partner Occupation"
                            fill="outline"
                            labelPlacement="floating"
                            style={{ "--color": "#000" }}
                            onIonChange={(e) => handleChange("pOccupation", e.detail.value!)}
                        >
                          {Occupations.map((occupation, index) => (
                            <IonSelectOption key={index} value={occupation}>{occupation}</IonSelectOption>
                          ))}
                        </IonSelect>
                  </IonItem>
                </IonCol>
                {/*Partner Income*/}
                <IonCol size='12' size-md='6'>
                  <IonItem lines="none" style={{ "--background": "#fff","--color": "#000", '--background-hover':'transparent', }}>
                    <IonSelect
                            className='ion-margin'
                            label="Partner Income"
                            fill="outline"
                            labelPlacement="floating"
                            style={{ "--color": "#000" }}
                            onIonChange={(e) => handleChange("pIncome", e.detail.value!)}
                        >
                          {Income.map((incomeRange, index) => (
                            <IonSelectOption key={index} value={incomeRange}>{incomeRange}</IonSelectOption>
                          ))}
                        </IonSelect>
                  </IonItem>
                </IonCol>             
                </IonRow>
              </IonGrid>
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

              <IonGrid>
                <IonRow>
                  {/* REGION */}
                  <IonCol size='12' size-md='6'>
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
                  <IonCol size='12' size-md='6'>
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
              </IonGrid>

              <IonGrid>
                <IonRow>
                  {/* MUNICIPALITY */}
                  <IonCol size='12' size-md='6'>
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
                  <IonCol size='12' size-md='6'>
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
              </IonGrid>

              <IonGrid>
                <IonRow>
                  {/* Zip Code */}
                  <IonCol size='12' size-md='6'>
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
              </IonGrid>
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
                    {/* Type Of School Attended */}
                    <IonCol size='12' size-md='6'>
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

                    {/* Current Year Level Of Education */}
                    <IonCol size='12' size-md='6'>
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
                            <IonSelectOption value="Not Attending School">Not Attending School</IonSelectOption>
                          </IonSelect>
                        </IonItem>
                    </IonCol>
                </IonRow>

                {/* Highest Educational Attainment */}
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
              
              <IonGrid>
                <IonRow>
                  <IonCol size="12" size-md='6'>
                    <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent', }}>
                      <IonSelect
                          className='ion-margin'
                          label="Pregnancy Status"
                          fill="outline"
                          labelPlacement="floating"
                          style={{"--color": "#000" }}
                          onIonChange={(e) => handleChange("pregnancy_status", e.detail.value!)}
                      >
                        <IonSelectOption value="Pregnant">Pregnant</IonSelectOption>
                        <IonSelectOption value="Not Pregnant">Not Pregnant</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>

                  <IonCol size="12" size-md='6'>
                    <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent', }}>
                      <IonSelect
                          className='ion-margin'
                          label="Stage of Pregnancy"
                          fill="outline"
                          labelPlacement="floating"
                          style={{"--color": "#000" }}
                          onIonChange={(e) => handleChange("stage_of_pregnancy", e.detail.value!)}
                      >
                          <IonSelectOption value="First Trimester (1-12 weeks)">First Trimester (1-12 weeks)</IonSelectOption>
                          <IonSelectOption value="Second Trimester (13-26 weeks)">Second Trimester (13-26 weeks)</IonSelectOption>
                          <IonSelectOption value="Third Trimester (27-40 weeks)">Third Trimester (27-40 weeks)</IonSelectOption>
                          <IonSelectOption value="N/A">N/A</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>

              <IonItem lines="none" style={{ "--background": "#fff",fontWeight: "bold", fontSize: "0.9rem" }}>
                <IonLabel style={{ color: "#000" }}>Medical History</IonLabel>
              </IonItem>

              <IonGrid>
                <IonRow>
                  {[
                    "Tuberculosis (14 days or more of cough)",
                    "Heart Diseases",
                    "Diabetes",
                    "Hypertension",
                    "Bronchial Asthma",
                    "Urinary Tract Infection",
                    "Parasitism",
                    "Goiter",
                    "Anemia",
                    "Malnutrition",
                    "Genital Tract Infection"
                  ].map((cond) => (
                    <IonCol size="12" size-md='6' key={cond}>
                      <IonItem lines="none" style={{ "--background": "#fff", '--background-hover':'transparent', }}>
                        <IonCheckbox 
                          labelPlacement="end" 
                          style={{ '--checkbox-background': '#ffffffff',
                                    '--checkbox-background-checked': '#ffffffff',
                                    '--border-color': '#000000ff',
                                    '--checkbox-icon-color': '#ffffff',
                                    '--checkmark-color':'#000000'
                                  }}
                          onIonChange={(e) => handleChange(`medical_${cond}`, e.detail.checked)}
                        >
                          <IonLabel style={{ color: "#000" }}>{cond}</IonLabel>
                        </IonCheckbox>
                      </IonItem>
                    </IonCol>
                  ))}
                </IonRow>
              </IonGrid>
               {/* Others input field */}
              <IonRow>
                <IonCol>
                  <IonItem lines="none" style={{ "--background": "#fff" }}>
                    <IonLabel position ="stacked" style={{ color: "#000", fontSize: "1.1rem", marginLeft: "5px" }}>Others Please specify</IonLabel>
                    <IonInput
                      className='ion-margin'
                      style={{ "--color": "#000" }}
                      value={healthData.medical_history_others}
                      onIonChange={(e) => handleChange("medical_history_others", e.detail.value!)}
                      placeholder="Specify other medical conditions"
                    />
                  </IonItem>
                </IonCol>
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