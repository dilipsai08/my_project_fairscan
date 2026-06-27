// Available diagnostic test & scan names for search autocomplete
export const diagnosticTests = [
    // Blood Tests
    "Complete Blood Count (CBC)",
    "Blood Glucose Fasting",
    "Blood Glucose PP (Post Prandial)",
    "HbA1c (Glycated Hemoglobin)",
    "Lipid Profile",
    "Liver Function Test (LFT)",
    "Kidney Function Test (KFT)",
    "Thyroid Profile (T3, T4, TSH)",
    "TSH (Thyroid Stimulating Hormone)",
    "Vitamin D Test",
    "Vitamin B12 Test",
    "Iron Studies / Serum Iron",
    "Serum Calcium",
    "Serum Electrolytes",
    "Uric Acid Test",
    "ESR (Erythrocyte Sedimentation Rate)",
    "CRP (C-Reactive Protein)",
    "Prothrombin Time (PT/INR)",
    "Blood Group & Rh Typing",
    "Hemoglobin Test",
    "Platelet Count",
    "Peripheral Blood Smear",
    "Reticulocyte Count",
    "Coagulation Profile",
    "D-Dimer Test",
    "Ferritin Test",
    "Folate (Folic Acid) Test",

    // Diabetes & Metabolic
    "Oral Glucose Tolerance Test (OGTT)",
    "Fasting Insulin",
    "C-Peptide Test",
    "Microalbumin (Urine)",

    // Liver & Kidney
    "Serum Creatinine",
    "Blood Urea Nitrogen (BUN)",
    "Serum Bilirubin",
    "SGOT / AST",
    "SGPT / ALT",
    "Alkaline Phosphatase (ALP)",
    "GGT (Gamma GT)",
    "Serum Albumin",
    "Serum Protein",

    // Cardiac
    "Troponin I / T",
    "CK-MB (Creatine Kinase-MB)",
    "BNP / NT-proBNP",
    "Homocysteine Test",
    "Apolipoprotein B",

    // Hormones
    "Testosterone Total",
    "Estradiol (E2)",
    "Progesterone Test",
    "Prolactin Test",
    "FSH (Follicle Stimulating Hormone)",
    "LH (Luteinizing Hormone)",
    "Cortisol Test",
    "DHEA-S Test",
    "Growth Hormone Test",
    "Parathyroid Hormone (PTH)",
    "Insulin-like Growth Factor (IGF-1)",

    // Infectious Disease
    "HIV 1 & 2 Test",
    "Hepatitis B Surface Antigen (HBsAg)",
    "Hepatitis C Antibody (Anti-HCV)",
    "Dengue NS1 Antigen",
    "Dengue IgG / IgM",
    "Malaria Antigen Test",
    "Typhoid Test (Widal)",
    "TB Gold / Quantiferon Test",
    "COVID-19 RT-PCR",
    "COVID-19 Rapid Antigen",
    "VDRL / RPR (Syphilis)",
    "Chikungunya IgM",

    // Urine & Stool
    "Urine Routine & Microscopy",
    "Urine Culture & Sensitivity",
    "24-Hour Urine Protein",
    "Stool Routine & Microscopy",
    "Stool Occult Blood Test",
    "Stool Culture",

    // Tumour Markers
    "PSA (Prostate Specific Antigen)",
    "CA-125",
    "CA 19-9",
    "CEA (Carcinoembryonic Antigen)",
    "AFP (Alpha Fetoprotein)",
    "Beta HCG",

    // Allergy
    "IgE Total",
    "Allergy Panel (Food)",
    "Allergy Panel (Inhalant)",

    // Autoimmune
    "ANA (Antinuclear Antibody)",
    "Anti-dsDNA",
    "Rheumatoid Factor (RF)",
    "Anti-CCP",

    // Imaging - X-Ray
    "X-Ray Chest PA",
    "X-Ray Abdomen",
    "X-Ray Spine (Cervical)",
    "X-Ray Spine (Lumbar)",
    "X-Ray Knee",
    "X-Ray Shoulder",
    "X-Ray Hand / Wrist",
    "X-Ray Pelvis",
    "X-Ray Skull",

    // Imaging - Ultrasound
    "Ultrasound Abdomen",
    "Ultrasound Pelvis",
    "Ultrasound KUB (Kidney, Ureter, Bladder)",
    "Ultrasound Thyroid",
    "Ultrasound Breast",
    "Ultrasound Obstetric (Pregnancy)",
    "Ultrasound Doppler (Vascular)",
    "Ultrasound Scrotum",
    "Ultrasound Neck",
    "Echocardiography (2D Echo)",

    // Imaging - CT Scan
    "CT Scan Brain (Plain)",
    "CT Scan Brain (Contrast)",
    "CT Scan Chest",
    "CT Scan Abdomen",
    "CT Scan Abdomen & Pelvis",
    "CT Scan Spine (Cervical)",
    "CT Scan Spine (Lumbar)",
    "CT Scan PNS (Paranasal Sinuses)",
    "CT Angiography (Coronary)",
    "CT Angiography (Peripheral)",
    "HRCT Chest (Lungs)",

    // Imaging - MRI
    "MRI Brain (Plain)",
    "MRI Brain (Contrast)",
    "MRI Spine (Cervical)",
    "MRI Spine (Lumbar)",
    "MRI Spine (Thoracic)",
    "MRI Knee",
    "MRI Shoulder",
    "MRI Abdomen",
    "MRI Pelvis",
    "MRI Whole Body",
    "MRI Breast",
    "MRI Cardiac",
    "MRA (MR Angiography)",

    // Cardiac Tests
    "ECG (Electrocardiogram)",
    "TMT (Treadmill Test)",
    "Holter Monitoring (24-hr ECG)",
    "Ambulatory BP Monitoring",

    // Neurological
    "EEG (Electroencephalogram)",
    "EMG / NCV (Nerve Conduction)",

    // Pulmonary
    "Pulmonary Function Test (PFT / Spirometry)",

    // Eye
    "Fundoscopy",
    "OCT (Optical Coherence Tomography)",
    "Visual Field Test",

    // ENT
    "Audiometry (Hearing Test)",
    "Tympanometry",

    // GI & Endoscopy
    "Upper GI Endoscopy",
    "Colonoscopy",
    "Sigmoidoscopy",

    // Bone
    "DEXA Scan (Bone Density)",

    // Nuclear Medicine
    "PET-CT Scan",
    "Thyroid Scan",
    "Bone Scan (Scintigraphy)",

    // Biopsy & Pathology
    "FNAC (Fine Needle Aspiration Cytology)",
    "Biopsy (Histopathology)",
    "Pap Smear",

    // Prenatal
    "Double Marker Test",
    "Triple Marker Test",
    "Quadruple Marker Test",
    "NT Scan (Nuchal Translucency)",
    "Anomaly Scan (Level 2 Ultrasound)",

    // Packages
    "Basic Health Checkup",
    "Full Body Checkup",
    "Master Health Checkup",
    "Cardiac Health Package",
    "Diabetes Screening Package",
    "Women's Health Package",
    "Men's Health Package",
    "Senior Citizen Health Package",
    "Pre-Employment Health Check"
];
