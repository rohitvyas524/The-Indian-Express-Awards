const formSchema = {

    
    

    "Section 1": {
        "section": "Participant Information",
        "description": "Please note: Entries will be accepted only from Unit Level. Group level applications will be disqualified.",
        "fields": [
            {
                "label": "Name of participating entity (Provide the full name of the entity)",
                "key": "participant_name",
                "type": "text",
                "required": true
            },

            {
                "label": "Type",
                "key": "type",
                "type": "select",
                "required": true,
                "options": [
                    "Private Hospital",
                    "Nursing Home",
                    "Public/Government Hospital",
                    "Medical Center (Single Speciality)",
                    "Speciality/Multispeciality",
                    "Any other (Please specify)"
                ]
            },
            {
                "label": "Year of incorporation for participating entity",
                "key": "incorporation_year",
                "type": "date",
                "required": false
            },

            {
                "label": "City",
                "key": "city",
                "type": "text",
                "required": true
            },
            {
                "label": "State",
                "key": "state",
                "type": "text",
                "required": true
            },
            {
                "label": "Pin code",
                "key": "pin_code",
                "type": "number",
                "required": true
            },
            {
                "label": "Website",
                "key": "website",
                "type": "url",
                "required": true
            },
            {
                "label": "Accreditation(s)",
                "key": "accreditation",
                "type": "select",
                "required": true,
                "options": [
                    "NABH",
                    "JCI",
                    "ISO",
                    "Any other (Please specify)"
                ]
            },
            {
                "label": "Name",
                "key": "spoc_name",
                "type": "text",
                "required": true
            },
            {
                "label": "Designation",
                "key": "spoc_designation",
                "type": "text",
                "required": true
            },
            {
                "label": "Contact Number",
                "key": "spoc_contact",
                "type": "text",
                "required": true
            },
            {
                "label": "Email ID",
                "key": "spoc_email",
                "type": "email",
                "required": true
            },
            {
                "label": "Geographic Operational Category (Choose one based on your scope of presence as of March 31, 2025) Please note a. National Level: Participating entity must have operations in at least two regions/zones, with a minimum of five branches across these regions/zones as on March 31, 2025. b. Regional Level: Participating entity must have at least 1 operating branch in only 1 zone, which may be North, South, East, or West as on March 31, 2025.",
                "key": "geographic_scope",
                "type": "select",
                "required": true,
                "options": [
                    "National Level",
                    "Regional Level - North",
                    "Regional Level - South",
                    "Regional Level - East",
                    "Regional Level - West"
                ]
            }
        ]
    },

    "Section 2": {
        "title": "Operational Matrix",
        "description": "Please write “NA” or “0” for fields not applicable to your organization. Details submitted should be of participating entity",
        "descriptionline": "Operational Parameters (April 2023 – March 2024) / (April 2024 – March 2025)",
        "fields": [
            {
                "label": "Total Number of Beds (Overall)",
                "type": "group",
                "required": true,
                "key": "total_beds",
                "fields": [
                    {
                        "label": "April 2023 – March 2024",
                        "type": "number",
                        "key": "2024",

                    },
                    {
                        "label": "April 2024 – March 2025",
                        "type": "number",
                        "key": "2025",

                    }
                ]
            },

            {
                "label": "Number of Beds Allocated to This Specialty",
                "type": "group",
                "required": true,
                "fields": [
                    {
                        "label": "April 2023 – March 2024",
                        "type": "number",
                        "key": "specialtyBeds_2023_24",
                        "required": true

                    },
                    {
                        "label": "April 2024 – March 2025",
                        "type": "number",
                        "key": "specialtyBeds_2024_25",
                        "required": true

                    }
                ]
            },
            {
                "label": "OPD Cases in This Specialty",
                "type": "group",
                "required": true,
                "fields": [
                    {
                        "label": "April 2023 – March 2024",
                        "type": "number",
                        "key": "opdCases_2023_24",
                        "required": true

                    },
                    {
                        "label": "April 2024 – March 2025",
                        "type": "number",
                        "key": "opdCases_2024_25",
                        "required": true

                    }
                ]
            },
            {
                "label": "IPD Admissions in This Specialty",
                "type": "group",
                "required": true,
                "fields": [
                    {
                        "label": "April 2023 – March 2024",
                        "type": "number",
                        "key": "ipdAdmissions_2023_24",
                        "required": true

                    },
                    {
                        "label": "April 2024 – March 2025",
                        "type": "number",
                        "key": "ipdAdmissions_2024_25",
                        "required": true

                    }
                ]
            },
            {
                "label": "Number of Surgeries / Procedures (If applicable)",
                "type": "group",
                "required": false,
                "fields": [
                    {
                        "label": "April 2023 – March 2024",
                        "type": "number",
                        "key": "surgeries_2023_24"
                    },
                    {
                        "label": "April 2024 – March 2025",
                        "type": "number",
                        "key": "surgeries_2024_25"
                    }
                ]
            },
            {
                "label": "Mortality Rate (if applicable)",
                "type": "group",
                "required": false,
                "fields": [
                    {
                        "label": "April 2023 – March 2024",
                        "type": "number",
                        "key": "mortality_2023_24"
                    },
                    {
                        "label": "April 2024 – March 2025",
                        "type": "number",
                        "key": "mortality_2024_25"
                    }
                ]
            },
            {
                "label": "Average Length of Stay (ALOS)",
                "type": "group",
                "required": true,
                "fields": [
                    {
                        "label": "April 2023 – March 2024",
                        "type": "number",
                        "key": "lengthofstay_2023_24",
                        "required": true

                    },
                    {
                        "label": "April 2024 – March 2025",
                        "type": "number",
                        "key": "lengthofstay_2024_25",
                        "required": true

                    }
                ]
            },
            {
                "label": "Specialty Consultants Available (Headcount)",
                "type": "group",
                "required": true,
                "fields": [
                    {
                        "label": "April 2023 – March 2024",
                        "type": "number",
                        "key": "consultants_2023_24",
                        "required": true

                    },
                    {
                        "label": "April 2024 – March 2025",
                        "type": "number",
                        "key": "consultants_2024_25",
                        "required": true

                    }
                ]
            },
            {
                "label": "Patient Satisfaction Score (if measured)",
                "type": "group",
                "required": true,
                "fields": [
                    {
                        "label": "April 2023 – March 2024",
                        "type": "number",
                        "key": "patientsatisfaction_2023_24",
                        "required": true

                    },
                    {
                        "label": "April 2024 – March 2025",
                        "type": "number",
                        "key": "patientsatisfaction_2024_25",
                        "required": true

                    }
                ]
            },
            {
                "label": "Clinical Outcome Indicators (Specialty-specific Success/Recovery Rates)",
                "type": "group",
                "required": true,
                "fields": [
                    {
                        "label": "April 2023 – March 2024",
                        "type": "number",
                        "key": "clinicaloutcome_2023_24",
                        "required": true

                    },
                    {
                        "label": "April 2024 – March 2025",
                        "type": "number",
                        "key": "clinicaloutcome_2024_25",
                        "required": true

                    }
                ]
            },
            {
                "label": "Average Turnaround Time (Diagnostics/Emergency)",
                "type": "group",
                "required": true,
                "fields": [
                    {
                        "label": "April 2023 – March 2024",
                        "type": "number",
                        "key": "avgturnaround_2023_24",
                        "required": true

                    },
                    {
                        "label": "April 2024 – March 2025",
                        "type": "number",
                        "key": "avgturnaround_2024_25",
                        "required": true

                    }
                ]
            },
            {
                "label": "Nursing / Paramedical Staff in this Specialty",
                "type": "group",
                "required": true,
                "fields": [
                    {
                        "label": "April 2023 – March 2024",
                        "type": "number",
                        "key": "nursingparastaff_2023_24",
                        "required": true

                    },
                    {
                        "label": "April 2024 – March 2025",
                        "type": "number",
                        "key": "nursingparastaff_2024_25",
                        "required": true

                    }
                ]
            },
            {
                "label": "Any Technology Used (e.g., AI, Robotics, Imaging Advancements, etc.)",
                "type": "group",
                "required": true,
                "fields": [
                    {
                        "label": "April 2023 – March 2024",
                        "type": "text",
                        "key": "technoused_2023_24",
                        "required": true

                    },
                    {
                        "label": "April 2024 – March 2025",
                        "type": "text",
                        "key": "technoused_2024_25",
                        "required": true

                    }
                ]
            }
        ]
    },
    "Section 3": {
        "title": "Case Study",
        "description": "Note:· The below case study must pertain to ONLY one initiative/project implemented in relevance to this category. Please fill a different application form if you wish to apply with another initiative/s, · The initiative/project should have been fully launched in the period April 01, 2023, to March 31, 2025,· The Awards shall be given to the initiatives which showcased impact in the period April 01, 2024, to March 31, 2025",
        "fields": [
            {
                "label": "Initiative Start Date",
                "type": "date",
                "key": "initiativeStartDate",
                "required": true
            },
            {
                "label": "Initiative End Date / Ongoing",
                "type": "date",
                "key": "initiativeEndDate",
                "required": true
            },
            {
                "label": "Name of Initiative/Project",
                "type": "text",
                "key": "initiativeName",
                "required": true
            },
            {
                "label": "Briefly describe your organization’s mission, scale of operations, and approach to delivering quality healthcare. (Max 200 words, preferably in bullets)",
                "type": "textarea",
                "key": "missionDescription",
                "required": true
            },
            {
                "label": "Describe a flagship initiative or practice your organization has implemented within this specialty. (Max 200 words, preferably in bullets)",
                "type": "textarea",
                "key": "flagshipInitiative",
                "required": true
            },
            {
                "label": "List key clinical and operational outcomes from the past 1 year related to this specialty. This may include success rates of procedures, readmission rates, morbidity/mortality data, patient throughput, or other KPIs relevant to this specialty. (Max 200 words, preferably in bullets)",
                "type": "textarea",
                "key": "clinicalOutcomes",
                "required": true
            },
            {
                "label": "How does your organization drive innovation and continuous improvement within this specialty, especially in overcoming implementation challenges? (Max 200 words, preferably in bullets)",
                "type": "textarea",
                "key": "innovationApproach",
                "required": true
            },
            {
                "label": "Share how this model has been designed for long-term impact and adaptability. Mention resource optimization, cost-effectiveness, training, community outreach, or potential for replication in other settings. (Max 200 words, preferably in bullets)",
                "type": "textarea",
                "key": "longTermImpact",
                "required": true
            },
            {
                "label": "Why should your organization win the award in this specialty category? (Max 200 words, preferably in bullets)",
                "type": "textarea",
                "key": "awardJustification",
                "required": true
            }
        ]
    },

    "Section 4": {
        "section": "Supporting Documents",
        "fields": [
            // {
            //     "label": "Incorporation/ GST Certificate",
            //     "key": "incorporationcert",
            //     "type": "file",
            //     "required": true
            // },
            // {
            //     "label": "Outcome Data / Clinical Reports (Evidence of measurable impact across specialties—e.g., clinical outcomes, recovery data, service integration success, or readmission trends.)",
            //     "key": "outcomedata",
            //     "type": "file",
            //     "required": true
            // },
            // {
            //     "label": "Proof of Accreditation/Certification",
            //     "key": "proofofcert",
            //     "type": "file",
            //     "filetype": ".pdf,.png",
            //     "required": true
            // },
            {
                "label": "Patient Testimonials/Feedback",
                "key": "patienttesti",
                "type": "text",
                "required": false
            },
            {
                "label": "Any Other Supporting Document",
                "key": "supportingdoc",
                "type": "text",
                "required": false
            }
        ]
    },


    "Section 5": {
        "section": "Declaration",
        "description": "As a matter of record, I/we hereby declare that the information provided in the application form and the supporting documents submitted for the FE Healthcare Awards 2025 is, to the best of my/our knowledge and belief, true, correct, and complete. I/we understand that in the event any information is found to be false, untrue, misleading, or misrepresented, I/we shall be held liable and responsible for the same.",
        "fields": [
            {
                "label": "Initiative mentioned in the application is completely executed and fully implemented in the period April 01, 2023, to March 31, 2025",
                "key": "declaration_implementation",
                "type": "checkbox",
                "required": true
            },
            {
                "label": "The impact demonstrated and results showcased by initiative is in the period April 01, 2024, to March 31, 2025",
                "key": "declaration_impact",
                "type": "checkbox",
                "required": true
            },
            {
                "label": "I/we further agree that the information provided has been approved by the Registrar or equivalent personnel of my/ our institution.",
                "key": "declaration_approval",
                "type": "checkbox",
                "required": true
            },
            {
                "label": "Participant Name",
                "key": "participant_name_declaration",
                "type": "text",
                "required": true
            },
            {
                "label": "Designation",
                "key": "participant_designation_declaration",
                "type": "text",
                "required": true
            },
            {
                "label": "Date",
                "key": "declaration_date",
                "type": "datetime-local",
                "readOnly": true,
                "required": false
            },
            {
                "label": "Ready For Submission ?",
                "key": "ready_for_submission",
                "type": "select",
                "default": "No, Keep in Draft",
                "required": true,
                "options": [
                    "Yes, Final Submission",
                    "No, Keep in Draft"
                ]
            }
        ]
    }



}

export default formSchema;

