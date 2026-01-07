'use client'
import { useState, useEffect, useRef } from 'react';
import { 
  Scale, ArrowRight, Upload, Cpu, 
  FileText, User, Settings, LogOut, 
  Bell, Search, ChevronDown, PlusCircle,
  Brain, MessageSquare,  Calendar,
  Clock, Shield, CheckCircle, AlertTriangle,Building,Award,Gavel,FileSignature,Globe,Umbrella,Home,Users,Filter,BadgeCheck,BookOpen,CalendarClock,
  XCircle, Bot, Loader2, Sparkles, Mic, PhoneOff,
  UserCheck,Star,Briefcase,Heart,ArrowUpRight,X,Send
} from 'lucide-react';
import Vapi from '@vapi-ai/web';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// VAPI configuration
const VAPI_API_KEY = '8dfdd899-8c45-418d-86bb-8655a4146e66';
const VAPI_BASE_URL = 'https://api.vapi.ai';

export default function CasePreparationDashboard() {
  const { user } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('prepare');
  const [caseStatus, setCaseStatus] = useState('preparing');

  const [caseProgress, setCaseProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAIOpponentForm, setShowAIOpponentForm] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
 
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdAssistantId, setCreatedAssistantId] = useState(null);
  const [vapi, setVapi] = useState(null);
  const [callStatus, setCallStatus] = useState('disconnected');
  const [isMuted, setIsMuted] = useState(false);
  const [showCourtroomModal, setShowCourtroomModal] = useState(false);
  const [userCases, setUserCases] = useState([]);
  const [currentCase, setCurrentCase] = useState(null);
  const transcript ='';
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  
// Research Feature States
  const [researchQuery, setResearchQuery] = useState('');
  const [researchResults, setResearchResults] = useState([]);
  const [isResearching, setIsResearching] = useState(false);

  
  const [newCaseData, setNewCaseData] = useState({
    name: '',
    type: 'AI vs AI' // default value
  });

  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const notifications= 2;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const searchTerm = '';
  const [favoriteSpecialties, setFavoriteSpecialties] = useState(['corporate', 'intellectual']);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filteredRating, setFilteredRating] = useState(0);
  const [showChatOptions, setShowChatOptions] = useState(false);
  const chatContainerRef = useRef(null);
  
  // Legal specialties with their respective lawyer profiles
  const legalSpecialties = [
    {
      id: 'corporate',
      name: 'Corporate Law',
      icon: <Building size={20} />,
      description: 'Business formation, contracts, mergers & acquisitions',
      color: 'from-blue-600 to-blue-800',
      bgGradient: 'from-blue-900/20 to-blue-800/5',
      clients: 1243,
      caseWinRate: 92,
      lawyers: [
        { 
          id: 'corp1', 
          name: 'Alexandra Morgan', 
          rating: 4.9, 
          experience: '12 years', 
          avatar: '👩‍⚖️',
          responseTime: 'Under 2 min',
          expertise: ['Mergers', 'Startups', 'Compliance'],
          languages: ['English', 'French'],
          cases: 187,
          premium: true
        },
        { 
          id: 'corp2', 
          name: 'Michael Chen', 
          rating: 4.7, 
          experience: '9 years', 
          avatar: '👨‍⚖️',
          responseTime: '~3 min',
          expertise: ['Contracts', 'Business Formation'],
          languages: ['English', 'Mandarin'],
          cases: 142
        }
      ]
    },
    {
      id: 'intellectual',
      name: 'Intellectual Property',
      icon: <Award size={20} />,
      description: 'Patents, trademarks, copyrights, trade secrets',
      color: 'from-purple-600 to-purple-800',
      bgGradient: 'from-purple-900/20 to-purple-800/5',
      clients: 895,
      caseWinRate: 88,
      lawyers: [
        { 
          id: 'ip1', 
          name: 'David Park', 
          rating: 4.8, 
          experience: '15 years', 
          avatar: '👨‍⚖️',
          responseTime: 'Under 2 min',
          expertise: ['Patents', 'Trademarks', 'IP Litigation'],
          languages: ['English', 'Korean'],
          cases: 236,
          premium: true
        },
        { 
          id: 'ip2', 
          name: 'Sarah Johnson', 
          rating: 4.9, 
          experience: '11 years', 
          avatar: '👩‍⚖️',
          responseTime: '~2 min',
          expertise: ['Copyright', 'Digital Rights'],
          languages: ['English'],
          cases: 189
        }
      ]
    },
    {
      id: 'litigation',
      name: 'Litigation',
      icon: <Gavel size={20} />,
      description: 'Civil lawsuits, dispute resolution, court proceedings',
      color: 'from-red-600 to-red-800',
      bgGradient: 'from-red-900/20 to-red-800/5',
      clients: 1578,
      caseWinRate: 85,
      lawyers: [
        { 
          id: 'lit1', 
          name: 'Robert Gonzalez', 
          rating: 4.7, 
          experience: '18 years', 
          avatar: '👨‍⚖️',
          responseTime: '~4 min',
          expertise: ['Commercial Litigation', 'Appeals'],
          languages: ['English', 'Spanish'],
          cases: 312,
          premium: true
        },
        { 
          id: 'lit2', 
          name: 'Jennifer Wu', 
          rating: 4.6, 
          experience: '8 years', 
          avatar: '👩‍⚖️',
          responseTime: '~5 min',
          expertise: ['Civil Litigation', 'Class Actions'],
          languages: ['English', 'Cantonese'],
          cases: 98
        }
      ]
    },
    {
      id: 'contract',
      name: 'Contract Law',
      icon: <FileSignature size={20} />,
      description: 'Contract drafting, review, negotiation, breach remedies',
      color: 'from-green-600 to-green-800',
      bgGradient: 'from-green-900/20 to-green-800/5',
      clients: 2146,
      caseWinRate: 94,
      lawyers: [
        { 
          id: 'con1', 
          name: 'Thomas Rivera', 
          rating: 4.8, 
          experience: '10 years', 
          avatar: '👨‍⚖️',
          responseTime: 'Under 2 min',
          expertise: ['Contract Drafting', 'Negotiations', 'Breach Analysis'],
          languages: ['English', 'Spanish'],
          cases: 276,
          premium: true
        }
      ]
    },
    {
      id: 'international',
      name: 'International Law',
      icon: <Globe size={20} />,
      description: 'Cross-border transactions, trade regulations, foreign policy',
      color: 'from-cyan-600 to-cyan-800',
      bgGradient: 'from-cyan-900/20 to-cyan-800/5',
      clients: 642,
      caseWinRate: 89,
      lawyers: [
        { 
          id: 'int1', 
          name: 'Sophia Müller', 
          rating: 4.9, 
          experience: '14 years', 
          avatar: '👩‍⚖️',
          responseTime: '~2 min',
          expertise: ['International Trade', 'EU Law', 'Cross-border Disputes'],
          languages: ['English', 'German', 'French'],
          cases: 154,
          premium: true
        }
      ]
    },
    {
      id: 'insurance',
      name: 'Insurance Law',
      icon: <Umbrella size={20} />,
      description: 'Insurance claims, coverage disputes, bad faith',
      color: 'from-amber-600 to-amber-800',
      bgGradient: 'from-amber-900/20 to-amber-800/5',
      clients: 987,
      caseWinRate: 86,
      lawyers: [
        { 
          id: 'ins1', 
          name: 'Jonathan Clark', 
          rating: 4.6, 
          experience: '9 years', 
          avatar: '👨‍⚖️',
          responseTime: '~4 min',
          expertise: ['Claims Processing', 'Coverage Disputes', 'Bad Faith Claims'],
          languages: ['English'],
          cases: 113
        }
      ]
    },
    {
      id: 'realestate',
      name: 'Real Estate Law',
      icon: <Home size={20} />,
      description: 'Property transactions, leases, title issues, zoning',
      color: 'from-orange-600 to-orange-800',
      bgGradient: 'from-orange-900/20 to-orange-800/5',
      clients: 1358,
      caseWinRate: 91,
      lawyers: [
        { 
          id: 'real1', 
          name: 'Maria Rodriguez', 
          rating: 4.7, 
          experience: '12 years', 
          avatar: '👩‍⚖️',
          responseTime: '~3 min',
          expertise: ['Property Transactions', 'Leases', 'Landlord-Tenant Disputes'],
          languages: ['English', 'Spanish'],
          cases: 201
        }
      ]
    },
    {
      id: 'family',
      name: 'Family Law',
      icon: <Users size={20} />,
      description: 'Divorce, custody, adoption, domestic relations',
      color: 'from-rose-600 to-rose-800',
      bgGradient: 'from-rose-900/20 to-rose-800/5',
      clients: 1124,
      caseWinRate: 90,
      lawyers: [
        { 
          id: 'fam1', 
          name: 'Elizabeth Taylor', 
          rating: 4.8, 
          experience: '15 years', 
          avatar: '👩‍⚖️',
          responseTime: 'Under 2 min',
          expertise: ['Divorce', 'Child Custody', 'Adoption'],
          languages: ['English'],
          cases: 264,
          premium: true
        }
      ]
    }
  ];
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSampleQuestion = (question) => {
    setInputMessage(question);
  };

  const sendMessageToGroq = async (message, lawyer) => {
    try {
      // Ensure your environment variable is properly set
    
  
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': `Bearer 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`
        },
        body: JSON.stringify({
          model: 'gemma2-9b-it', // or 'llama2-70b-4096'
          messages: [
            {
              role: 'system',
              content: lawyer.systemPrompt || 
                `You are ${lawyer.name}, a ${lawyer.experience} experienced ${selectedSpecialty.name} lawyer. 
                Provide professional legal advice in clear, concise terms.`
            },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.3,
          max_tokens: 1024,
          stream: false // Ensure this is false unless you handle streaming
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Get detailed error
        console.error('Groq API Error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.choices[0]?.message?.content || 
        "I couldn't generate a response. Please try again.";
  
    } catch (error) {
      console.error('Error calling Groq API:', error);
      return `I'm having trouble connecting to the legal advice service. (${error.message})`;
    }
  };


  
  // Toggle favorite specialty
  const toggleFavorite = (specialtyId) => {
    if (favoriteSpecialties.includes(specialtyId)) {
      setFavoriteSpecialties(favoriteSpecialties.filter(id => id !== specialtyId));
    } else {
      setFavoriteSpecialties([...favoriteSpecialties, specialtyId]);
    }
  };
  
  // Filter specialties based on search term
  const filteredSpecialties = legalSpecialties.filter(specialty => 
    specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    specialty.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter lawyers based on rating
  const getFilteredLawyers = (lawyers) => {
    return lawyers.filter(lawyer => lawyer.rating >= filteredRating);
  };

  
  
  // Start a chat with selected lawyer
  const startChat = (lawyer, specialty) => {
    lawyer.specialty = specialty.name;
    setSelectedLawyer(lawyer);
    setSelectedSpecialty(specialty);
    setMessages([
      {
        sender: 'lawyer',
        text: `Hello, I'm ${lawyer.name}, your AI legal advisor for ${specialty.name}. I have ${lawyer.experience} experience in ${lawyer.expertise.join(', ')}. How can I assist you today?`,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }
    ]);
  };
  
  // Sample legal questions for quick selection
  const sampleQuestions = [
    "What's the process for filing a trademark?",
    "How do I respond to a contract breach?",
    "What are my rights in this situation?",
    "Can you review this legal document?"
  ];
  
  // Select a legal specialty
  const selectSpecialty = (specialty) => {
    setSelectedSpecialty(specialty);
  };
  
  // Send a message in the chat
  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;
    
    // Add user message
    const userMessage = {
      sender: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setShowChatOptions(false);
    
    // Get AI response from Groq API
    try {
      const aiResponse = await sendMessageToGroq(inputMessage, selectedLawyer);
      
      const lawyerMessage = {
        sender: 'lawyer',
        text: aiResponse,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      
      setMessages(prev => [...prev, lawyerMessage]);
    } catch (error) {
      const errorMessage = {
        sender: 'lawyer',
        text: "I'm having trouble processing your request. Please try again.",
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      console.log(error)
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  // Use a sample question


  
  // Reset chat and return to lawyer selection
  const endConsultation = () => {
    setSelectedLawyer(null);
    setSelectedSpecialty(null);
    setMessages([]);
  };
  
  // Get featured (premium) lawyers across all specialties
  const getFeaturedLawyers = () => {
    let featured = [];
    legalSpecialties.forEach(specialty => {
      specialty.lawyers.forEach(lawyer => {
        if (lawyer.premium) {
          featured.push({...lawyer, specialtyName: specialty.name, specialtyId: specialty.id});
        }
      });
    });
    return featured.slice(0, 3); // Return top 3 featured lawyers
  };
  



  
  const [assistant, setAssistant] = useState({
    name: 'AI Opponent',
    firstMessage: 'I am your AI legal opponent. I will analyze your case and identify potential weaknesses.',
    model: {
      provider: 'openai',
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 4000,
      messages: [{ content: 'You are an expert legal AI opponent designed to find weaknesses in legal arguments and case preparation. Your goal is to help the user improve their legal strategy by identifying potential counterarguments and vulnerabilities.' }]
    }
  });
  const [allDocuments, setAllDocuments] = useState([]);
  const [allAssistants, setAllAssistants] = useState([]);

  // Initialize Vapi client with event handlers
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const vapiClient = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
      setVapi(vapiClient);
    }
  }, []);

  // Load user cases when user is available
  useEffect(() => {
    if (user?.id) {
      loadUserCases();
      fetchAllDocuments();
      fetchAllAssistants();
    }
  }, [user]);

  const fetchAllDocuments = async () => {
    try {
      const { data: cases, error } = await supabase
        .from('cases')
        .select('id, name, documents')
        .eq('user_id', user.id);
  
      if (error) throw error;
  
      // Flatten all documents with case information
      const docs = cases.flatMap(caseItem => 
        caseItem.documents?.map(doc => ({
          ...doc,
          caseId: caseItem.id,
          caseName: caseItem.name
        })) || []
      );
  
      setAllDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setErrorMessage('Failed to load documents');
      setShowErrorAlert(true);
    }
  };
  
  const fetchAllAssistants = async () => {
    try {
      const { data: cases, error } = await supabase
        .from('cases')
        .select('id, name, assistant_id, status')
        .eq('user_id', user.id)
        .not('assistant_id', 'is', null);
  
      if (error) throw error;
  
      // Get assistant details for each case that has an assistant
      const assistants = await Promise.all(
        cases.map(async (caseItem) => {
          const response = await fetch(`${VAPI_BASE_URL}/assistant/${caseItem.assistant_id}`, {
            headers: {
              'Authorization': `Bearer ${VAPI_API_KEY}`,
            },
          });
          const assistantData = await response.json();
          return {
            ...assistantData,
            caseId: caseItem.id,
            caseName: caseItem.name,
            caseStatus: caseItem.status
          };
        })
      );
  
      setAllAssistants(assistants);
    } catch (error) {
      console.error('Error fetching assistants:', error);
      setErrorMessage('Failed to load assistants');
      setShowErrorAlert(true);
    }
  };

  // Load user cases from Supabase
  const loadUserCases = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUserCases(data || []);
      
      // Set the most recent case as current case
      if (data?.length > 0) {
        setCurrentCase(data[0]);
        setCaseStatus(data[0].status || 'preparing');
        setCaseProgress(data[0].progress || 0);
        if (data[0].assistant_id) {
          setCreatedAssistantId(data[0].assistant_id);
        }
      }
    } catch (error) {
      console.error('Error loading cases:', error);
      setErrorMessage('Failed to load your cases');
      setShowErrorAlert(true);
    }
  };

  // Create a new case in Supabase
   // Create a new case in Supabase
   const createNewCase = async () => {
    if (!user?.id) return;
  
    try {
      const { data, error } = await supabase
        .from('cases')
        .insert([{
          user_id: user.id,
          name: newCaseData.name || 'New Case',
          status: 'preparing',
          progress: 0,
          case_type: newCaseData.type,
          documents: []
        }])
        .select();
  
      if (error) throw error;
  
      if (data?.length > 0) {
        setCurrentCase(data[0]);
        setUserCases([data[0], ...userCases]);
        setCaseStatus('preparing');
        setCaseProgress(0);
        setShowNewCaseModal(false);
        setNewCaseData({ name: '', type: 'AI vs AI' }); // Reset form
      }
    } catch (error) {
      console.error('Error creating case:', error);
      setErrorMessage('Failed to create new case');
      setShowErrorAlert(true);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCaseSelection = async (caseId) => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single();
  
      if (error) throw error;
  
      if (data) {
        setCurrentCase(data);
        setCaseStatus(data.status || 'preparing');
        setCaseProgress(data.progress || 0);
        setCreatedAssistantId(data.assistant_id || null);
      }
    } catch (error) {
      console.error('Error loading case details:', error);
      setErrorMessage('Failed to load case details');
      setShowErrorAlert(true);
    }
  };

  // Handle document upload to VAPI
  const handleDocumentUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${VAPI_BASE_URL}/file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
        },
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        setUploadStatus('success');
        setUploadProgress(100);
        setFiles([...files, result.id]);
        setSelectedFile(result.id);
        
        // Also save to Supabase storage for our own records
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `documents/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('case-documents')
          .upload(filePath, file);

        if (!uploadError) {
          // Update case with document info
          const { data: { publicUrl } } = supabase.storage
            .from('case-documents')
            .getPublicUrl(filePath);

          const newDoc = {
            name: file.name,
            url: publicUrl,
            uploaded_at: new Date().toISOString(),
            vapi_file_id: result.id
          };

          await supabase
            .from('cases')
            .update({
              documents: [...(currentCase?.documents || []), newDoc]
            })
            .eq('id', currentCase?.id);

          // Update allDocuments state
          setAllDocuments([...allDocuments, {
            ...newDoc,
            caseId: currentCase?.id,
            caseName: currentCase?.name
          }]);
        }

        // Start analysis simulation
        setCaseStatus('analyzing');
        simulateAnalysis();
      } else {
        throw new Error('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('error');
      setErrorMessage(error.message || 'Failed to upload file');
      setShowErrorAlert(true);
    } finally {
      setUploading(false);
    }
  };

  // Simulate AI analysis progress
  const simulateAnalysis = () => {
    let progress = caseProgress;
    const interval = setInterval(() => {
      progress += 5;
      setCaseProgress(progress);
      updateCase({ progress });
      
      if (progress >= 100) {
        clearInterval(interval);
        setCaseStatus('ready');
        updateCase({ status: 'ready', progress: 100 });
      }
    }, 1000);
  };

  // Update case in Supabase
  const updateCase = async (updates) => {
    if (!currentCase?.id) return;

    try {
      const { data, error } = await supabase
        .from('cases')
        .update(updates)
        .eq('id', currentCase.id)
        .select();

      if (error) throw error;

      if (data?.length > 0) {
        setCurrentCase(data[0]);
        setUserCases(userCases.map(c => c.id === data[0].id ? data[0] : c));
      }
    } catch (error) {
      console.error('Error updating case:', error);
    }
  };

  // Start call with Vapi
  const startCall = async () => {
    if (!vapi || !createdAssistantId) return;
    
    try {
      setCallStatus('connecting');
      await vapi.start(createdAssistantId);
      setShowCourtroomModal(true);
    } catch (error) {
      console.error('Error starting call:', error);
      setErrorMessage(error.message || 'Failed to start the call');
      setShowErrorAlert(true);
      setCallStatus('disconnected');
    }
  };

  // End call with Vapi
  const endCall = async () => {
    if (!vapi) return;
    try {
      await vapi.stop();
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  // Toggle mute during call
  const toggleMute = () => {
    if (!vapi) return;
    const newMutedState = !isMuted;
    vapi.setMuted(newMutedState);
    setIsMuted(newMutedState);
  };

  // Create AI Assistant using VAPI API
  const createAssistant = async () => {
    setIsLoading(true);
    setShowErrorAlert(false);
    
    try {
      const assistantData = {
        name: assistant.name,
        firstMessage: assistant.firstMessage,
        model: {
          provider: assistant.model.provider,
          model: assistant.model.model,
          temperature: assistant.model.temperature,
          maxTokens: assistant.model.maxTokens,
          messages: assistant.model.messages[0].content ? [
            {
              role: 'system',
              content: assistant.model.messages[0].content
            }
          ] : undefined
        },
        transcriber: {
          provider: "deepgram"
        },
        voice: {
          provider: "azure",
          voiceId: "en-US-JennyNeural"
        }
      };
      
      if (selectedFile) {
        assistantData.model.knowledgeBase = {
          provider: 'canonical',
          fileIds: [selectedFile]
        };
      }
      
    //  if (selectedTool) {
    //    assistantData.model.toolIds = [selectedTool];
    //  }
      
      const response = await fetch(`${VAPI_BASE_URL}/assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assistantData),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred while creating the assistant.');
      }
      
      setCreatedAssistantId(data.id);
      setShowSuccessAlert(true);
      triggerConfetti();
      
      // Save assistant to Supabase
      await supabase
        .from('cases')
        .update({ 
          assistant_id: data.id,
          status: 'ready'
        })
        .eq('id', currentCase.id);

      // Refresh assistants list
      await fetchAllAssistants();

      setTimeout(() => {
        setShowSuccessAlert(false);
        setShowAIOpponentForm(false);
        setCaseStatus('ready');
      }, 3000);
      
    } catch (error) {
      console.error('Error creating assistant:', error);
      setErrorMessage(error.message || 'An error occurred while creating the assistant.');
      setShowErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child, grandchild] = field.split('.');
      setAssistant(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandchild 
            ? { ...prev[parent][child], [grandchild]: value }
            : value
        }
      }));
    } else {
      setAssistant(prev => ({ ...prev, [field]: value }));
    }
  };
  
  const handleNestedInputChange = (parent, field, value) => {
    setAssistant(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };
  
  const handleSystemPromptChange = (value) => {
    setAssistant(prev => ({
      ...prev,
      model: {
        ...prev.model,
        messages: [{ content: value }]
      }
    }));
  };
  
  const triggerConfetti = () => {
    console.log('Confetti triggered!');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

 
// New Research Function
  const performLegalResearch = async () => {
    if (!researchQuery.trim()) return;

    setIsResearching(true);
    setResearchResults([]);
    setShowErrorAlert(false);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`
        },
        body: JSON.stringify({
          model: 'compound-beta',
          messages: [
            {
              role: 'system',
              content: 'You are a legal research assistant. Provide accurate, concise summaries of relevant legal information, including case law, statutes, or articles, based on web search results. Format responses with a summary and source details.'
            },
            {
              role: 'user',
              content: researchQuery
            }
          ],
          search_settings: {
            exclude_domains: ['wikipedia.org'],
            include_domains: ['*.gov', '*.edu', '*.org']
          },
          temperature: 0.5,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch research results');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || 'No results found.';
      const executedTools = data.choices[0]?.message?.executed_tools || [];

      const results = executedTools
        .filter(tool => tool.type === 'web_search')
        .flatMap(tool => tool.results || [])
        .map(result => ({
          title: result.title || 'Untitled',
          snippet: result.snippet || 'No description available.',
          url: result.url || '#',
          publishedDate: result.published_date || 'Unknown date'
        }));

      setResearchResults(results.length > 0 ? results : [{ title: 'No Results', snippet: content, url: '#', publishedDate: 'N/A' }]);
      
    } catch (error) {
      console.error('Error performing research:', error);
      setErrorMessage(error.message || 'Failed to perform legal research');
      setShowErrorAlert(true);
    } finally {
      setIsResearching(false);
    }
  };

  // Save Research Result to Case
  const saveResearchToCase = async (result) => {
    if (!currentCase?.id) {
      setErrorMessage('No active case selected');
      setShowErrorAlert(true);
      return;
    }

    try {
      const newDoc = {
        name: result.title,
        url: result.url,
        uploaded_at: new Date().toISOString(),
        type: 'research_result',
        content: result.snippet
      };

      await supabase
        .from('cases')
        .update({
          documents: [...(currentCase?.documents || []), newDoc]
        })
        .eq('id', currentCase.id);

      setAllDocuments([...allDocuments, {
        ...newDoc,
        caseId: currentCase.id,
        caseName: currentCase.name
      }]);

      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      console.error('Error saving research:', error);
      setErrorMessage('Failed to save research result');
      setShowErrorAlert(true);
    }
  };


  // Sample data for UI (will be replaced by Supabase data)
  const recentActivities = [
    { action: "Document uploaded", time: "10 minutes ago", icon: <Upload size={16} /> },
    { action: "AI analysis complete", time: "1 hour ago", icon: <Cpu size={16} /> },
    { action: "Strategy recommendation", time: "2 hours ago", icon: <Brain size={16} /> },
    { action: "Case status updated", time: "5 hours ago", icon: <FileText size={16} /> }
  ];
  
  return (
    <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-gray-100 min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-gray-950 bg-opacity-80 border-r border-indigo-900/30 transition-all duration-300 fixed h-full z-30`}>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-indigo-900 bg-opacity-50">
                <Scale className="h-6 w-6 text-indigo-400" />
              </div>
              {!isCollapsed && (
                <span className="ml-3 text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">LexAI</span>
              )}
            </div>
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="p-1 rounded-md hover:bg-gray-800 text-gray-400"
            >
              <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'rotate-90' : '-rotate-90'}`} />
            </button>
          </div>
          
          <div className="mt-8">
            <ul className="space-y-2 px-3">
              <li>
                <button 
                  onClick={() => setActiveTab('prepare')}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeTab === 'prepare' ? 'bg-indigo-900/30 text-indigo-300' : 'hover:bg-gray-800/50'}`}
                >
                  <Brain className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-3">Case Preparation</span>}
                </button>
              </li>
            
              <li>
                <button 
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeTab === 'chat' ? 'bg-indigo-900/30 text-indigo-300' : 'hover:bg-gray-800/50'}`}
                >
                  <MessageSquare className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-3">AI Assistant</span>}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-indigo-900/30 text-indigo-300' : 'hover:bg-gray-800/50'}`}
                >
                  <UserCheck className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-3">Consult a Lawyer</span>}
                </button>
              </li>
             <li>
                <button 
                  onClick={() => setActiveTab('research')}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeTab === 'research' ? 'bg-indigo-900/30 text-indigo-300' : 'hover:bg-gray-800/50'}`}
                >
                  <Search className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-3">Legal Research</span>}
                </button>
              </li>
            </ul>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className={`mb-3 ${isCollapsed ? 'hidden' : 'block'}`}>
              <div className="p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center mb-2">
                  <Shield className="h-4 w-4 text-indigo-400 mr-2" />
                  <span className="text-xs font-medium">Secure Mode</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Active</span>
                  <div className="w-8 h-4 bg-indigo-900 rounded-full relative">
                    <div className="absolute right-0 top-0 w-4 h-4 bg-indigo-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <ul>
              
              <li>
                <button className="flex items-center w-full p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                  <LogOut className="h-5 w-5 text-gray-400" />
                  {!isCollapsed && <span className="ml-3">Log Out</span>}
                </button>
              </li>
            </ul>
          </div>
        </aside>
        
        {/* Main Content */}
        <div className={`flex-grow transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
          {/* Top Navigation */}
          <header className="bg-gray-900/70 backdrop-blur-md border-b border-indigo-900/30 sticky top-0 z-20">
            <div className="flex items-center justify-between p-4">
              <div>
                <h1 className="text-xl font-bold">AI vs AI Case Preparation</h1>
                <p className="text-sm text-gray-400">Create and manage your AI legal battles</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="flex items-center bg-gray-800 rounded-lg p-2">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="bg-transparent border-none outline-none ml-2 text-sm w-48"
                    />
                  </div>
                </div>
                
                <button className="relative p-2 rounded-lg hover:bg-gray-800">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-indigo-500 rounded-full text-xs flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{user?.fullName || 'User'}</p>
                    <p className="text-xs text-gray-400">Premium Account</p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="p-6">

      
          {showNewCaseModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Create New Case</h3>
        <button 
          onClick={() => setShowNewCaseModal(false)}
          className="p-1 hover:bg-gray-800 rounded-full"
        >
          <XCircle className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Case Name</label>
          <input
            type="text"
            value={newCaseData.name}
            onChange={(e) => setNewCaseData({...newCaseData, name: e.target.value})}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500"
            placeholder="Enter case name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Case Type</label>
          <select
            value={newCaseData.type}
            onChange={(e) => setNewCaseData({...newCaseData, type: e.target.value})}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500"
          >
            <option value="AI vs AI">AI vs AI</option>
            <option value="Civil Litigation">Civil Litigation</option>
            <option value="Criminal Defense">Criminal Defense</option>
            <option value="Contract Dispute">Contract Dispute</option>
            <option value="Intellectual Property">Intellectual Property</option>
          </select>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button 
          onClick={() => setShowNewCaseModal(false)}
          className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800"
        >
          Cancel
        </button>
        <button 
          onClick={createNewCase}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={!newCaseData.name.trim()}
        >
          Create Case
        </button>
      </div>
    </div>
  </div>
)}

{activeTab === 'research' && (
  <div className="flex flex-col ">
    {/* Header with Search Bar */}
    <div className="bg-gray-900/95 border-b border-indigo-900/50 p-6 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
          Legal Research
        </h2>
        <button
          onClick={performLegalResearch}
          className={`px-6 py-2.5 rounded-lg flex items-center transition-all duration-200 font-medium ${
            isResearching || !researchQuery.trim()
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
          }`}
          disabled={isResearching || !researchQuery.trim()}
        >
          {isResearching ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Researching...
            </>
          ) : (
            <>
              <Search className="h-5 w-5 mr-2" />
              Perform Research
            </>
          )}
        </button>
      </div>
      <div className="flex items-center bg-gray-800/80 rounded-lg p-3 border border-gray-700 focus-within:border-indigo-500 transition-colors  mx-auto">
        <Search className="h-6 w-6 text-gray-400 ml-3" />
        <input
          type="text"
          value={researchQuery}
          onChange={(e) => setResearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && performLegalResearch()}
          placeholder="Enter your legal research query (e.g., 'landmark cases on trademark infringement')"
          className="flex-grow  bg-transparent border-none outline-none px-4 py-2 text-gray-100 placeholder-gray-500 text-base"
          aria-label="Legal research query input"
        />
      </div>
    </div>

    {/* Scrollable Research Results */}
    {researchResults.length > 0 ? (
   
   
      <ScrollArea className="flex-grow ">
        <div className="max-w-6xl mx-auto p-8 space-y-8">
          {researchResults.map((result, index) => (
            <div
              key={index}
              className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/40 hover:border-indigo-500/60 transition-all duration-500 shadow-2xl hover:shadow-indigo-900/20 group"
            >
              {/* Header Section */}
              <div className="p-8 pb-6">
                <div className="flex items-start space-x-5">
                  <div className="flex-shrink-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 p-4 rounded-xl border border-indigo-500/30">
                    <FileText className="h-8 w-8 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-indigo-100 transition-colors">
                     Your Data
                    </h3>
                    <div className="prose prose-lg prose-invert max-w-none">
                      <div className="text-gray-200 leading-relaxed space-y-4">
                        {result.snippet && typeof result.snippet === 'string' ? (
                          result.snippet.split('\n\n').map((paragraph, pIndex) => {
                            // Handle markdown-style bold text
                            const formattedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
                            
                            // Check if it's a numbered list item
                            if (paragraph.match(/^\d+\.\s\*\*/)) {
                              return (
                                <div key={pIndex} className="bg-gray-900/40 rounded-xl p-5 border-l-4 border-indigo-500/50 ml-4">
                                  <div 
                                    className="text-gray-100" 
                                    dangerouslySetInnerHTML={{ __html: formattedParagraph }}
                                  />
                                </div>
                              );
                            }
                            
                            // Check if it's a bullet point with asterisks
                            if (paragraph.startsWith('***') || paragraph.startsWith('* ')) {
                              return (
                                <div key={pIndex} className="flex items-start space-x-3 ml-6">
                                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <div 
                                    className="text-gray-200" 
                                    dangerouslySetInnerHTML={{ __html: formattedParagraph.replace(/^\*+\s*/, '') }}
                                  />
                                </div>
                              );
                            }
                            
                            // Check if it's a section header (starts with **)
                            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                              return (
                                <h4 key={pIndex} className="text-xl font-bold text-indigo-300 mt-8 mb-4 pb-2 border-b border-indigo-500/30">
                                  {paragraph.replace(/\*\*/g, '')}
                                </h4>
                              );
                            }
                            
                            // Regular paragraph
                            return (
                              <p 
                                key={pIndex} 
                                className="text-gray-200 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: formattedParagraph }}
                              />
                            );
                          })
                        ) : (
                          <p className="text-gray-200 leading-relaxed">{result.snippet}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="bg-gray-900/60 border-t border-gray-700/40 px-8 py-6 rounded-b-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    
                    <button
                      onClick={() => saveResearchToCase(result)}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg flex items-center transition-all duration-200 shadow-lg hover:shadow-indigo-500/25"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      Save to Case
                    </button>
                  </div>
                  {result.publishedDate && (
                    <div className="flex items-center text-sm text-gray-400">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                      Published: {result.publishedDate}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    ) : (
      <div className="flex-grow flex items-center justify-center bg-gray-900/60 rounded-2xl border border-gray-700/50 m-8 shadow-lg">
        <div className="text-center p-12">
          <Search className="h-16 w-16 mx-auto text-indigo-400 mb-6" />
          <h3 className="text-2xl font-bold text-white mb-3">No Research Results</h3>
          <p className="text-gray-300 text-base max-w-lg leading-relaxed">
            Enter a query above to start your legal research. Try searching for case law, statutes, or legal articles relevant to your case.
          </p>
        </div>
      </div>
    )}

    {/* Alerts */}
    {showSuccessAlert && (
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-900/90 border border-green-500/60 text-green-400 p-5 rounded-xl flex items-center max-w-lg shadow-2xl animate-slide-up">
        <CheckCircle className="h-6 w-6 mr-3" />
        <div>
          <p className="font-semibold text-base">Success!</p>
          <p className="text-sm">Research result saved to case.</p>
        </div>
      </div>
    )}
    {showErrorAlert && (
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-red-900/90 border border-red-500/60 text-red-400 p-5 rounded-xl flex items-center max-w-lg shadow-2xl animate-slide-up">
        <XCircle className="h-6 w-6 mr-3" />
        <div>
          <p className="font-semibold text-base">Error</p>
          <p className="text-sm">{errorMessage}</p>
        </div>
      </div>
    )}
  </div>
)}

             {activeTab === 'analytics' && (
                          <>
                            {!selectedLawyer ? (
                              <div>
                                {/* Featured section if no specialty is selected */}
                                {!selectedSpecialty && (
                                  <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                      <h2 className="text-2xl font-bold">Featured Legal Experts</h2>
                                      <button 
                                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                                        className="flex items-center bg-gray-800/70 hover:bg-gray-700/70 rounded-lg p-2 text-sm"
                                      >
                                        <Filter className="h-4 w-4 mr-2" />
                                        <span>Filter</span>
                                      </button>
                                    </div>
                                    
                                    {showFilterMenu && (
                                      <div className="bg-gray-800 rounded-lg p-4 mb-4 flex items-center">
                                        <span className="mr-3 text-sm font-medium">Minimum Rating:</span>
                                        <div className="flex space-x-2">
                                          {[0, 4, 4.5, 4.8].map((rating) => (
                                            <button 
                                              key={rating}
                                              onClick={() => setFilteredRating(rating)}
                                              className={`px-3 py-1 rounded-full text-xs ${
                                                filteredRating === rating 
                                                  ? 'bg-indigo-600 text-white' 
                                                  : 'bg-gray-700 text-gray-300'
                                              }`}
                                            >
                                              {rating === 0 ? 'All' : `${rating}+`}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      {getFeaturedLawyers().map((lawyer) => (
                                        <div 
                                          key={lawyer.id}
                                          className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-indigo-500/50 hover:bg-gray-800/80 transition-all cursor-pointer group"
                                          onClick={() => {
                                            const specialty = legalSpecialties.find(s => s.id === lawyer.specialtyId);
                                            startChat(lawyer, specialty);
                                          }}
                                        >
                                          <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                              <div className="text-3xl mr-3">{lawyer.avatar}</div>
                                              <div>
                                                <div className="flex items-center">
                                                  <h3 className="font-bold">{lawyer.name}</h3>
                                                  <BadgeCheck className="h-4 w-4 text-indigo-400 ml-1" />
                                                </div>
                                                <p className="text-sm text-gray-400">{lawyer.specialtyName}</p>
                                              </div>
                                            </div>
                                            <div className="flex items-center bg-gray-900/70 px-2 py-1 rounded-lg">
                                              <Star className="h-3 w-3 text-yellow-400 mr-1" />
                                              <span className="text-xs font-medium">{lawyer.rating}</span>
                                            </div>
                                          </div>
                                          
                                          <div className="space-y-3 mb-4">
                                            <div className="flex items-center text-sm">
                                              <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                              <span>Response time: {lawyer.responseTime}</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                              <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                                              <span>{lawyer.cases} cases completed</span>
                                            </div>
                                          </div>
                                          
                                          <div className="flex flex-wrap gap-2 mb-4">
                                            {lawyer.expertise.map((skill, idx) => (
                                              <span key={idx} className="bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded text-xs">
                                                {skill}
                                              </span>
                                            ))}
                                          </div>
                                          
                                          <button className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm flex items-center justify-center opacity-90 group-hover:opacity-100">
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            <span>Start Consultation</span>
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Legal Specialties section */}
                                <div className="mb-8">
                                  <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold">{selectedSpecialty ? 
                                      `${selectedSpecialty.name} Experts` : 
                                      'Browse Legal Specialties'
                                    }</h2>
                                    
                                    {selectedSpecialty && (
                                      <button 
                                        onClick={() => setSelectedSpecialty(null)}
                                        className="flex items-center text-indigo-400 hover:text-indigo-300"
                                      >
                                        <ArrowRight className="h-4 w-4 mr-1 transform rotate-180" />
                                        <span>Back to specialties</span>
                                      </button>
                                    )}
                                  </div>
                                  
                                  {!selectedSpecialty ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                      {filteredSpecialties.map((specialty) => (
                                        <div 
                                          key={specialty.id}
                                          onClick={() => selectSpecialty(specialty)}
                                          className="bg-gradient-to-br border border-gray-700 rounded-xl p-5 cursor-pointer hover:border-indigo-500/50 transition-all"
                                          style={{backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`, background: `linear-gradient(to bottom right, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.6))`}}
                                        >
                                          <div className="flex items-center justify-between mb-4">
                                            <div className={`p-3 rounded-full bg-gradient-to-r ${specialty.color}`}>
                                              {specialty.icon}
                                            </div>
                                            <button 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(specialty.id);
                                              }}
                                              className="p-2 rounded-full hover:bg-gray-700/50"
                                            >
                                              <Heart className={`h-4 w-4 ${
                                                favoriteSpecialties.includes(specialty.id) 
                                                  ? 'text-red-500 fill-red-500' 
                                                  : 'text-gray-400'
                                              }`} />
                                            </button>
                                          </div>
                                          
                                          <h3 className="text-lg font-bold mb-2">{specialty.name}</h3>
                                          <p className="text-sm text-gray-400 mb-4">{specialty.description}</p>
                                          
                                          <div className="flex items-center justify-between mb-4">
                                            <div>
                                              <p className="text-xs text-gray-400">Clients Served</p>
                                              <p className="font-bold">{specialty.clients.toLocaleString()}</p>
                                            </div>
                                            <div>
                                              <p className="text-xs text-gray-400">Win Rate</p>
                                              <p className="font-bold">{specialty.caseWinRate}%</p>
                                            </div>
                                          </div>
              
                                          <div className="flex items-center text-sm">
                                            <ArrowUpRight className="h-4 w-4 text-indigo-400 mr-2" />
                                            <span>Consult Now</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {getFilteredLawyers(selectedSpecialty.lawyers).map((lawyer) => (
                                        <div 
                                          key={lawyer.id}
                                          className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-indigo-500/50 hover:bg-gray-800/80 transition-all cursor-pointer group"
                                          onClick={() => startChat(lawyer, selectedSpecialty)}
                                        >
                                          <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                              <div className="text-3xl mr-3">{lawyer.avatar}</div>
                                              <div>
                                                <div className="flex items-center">
                                                  <h3 className="font-bold">{lawyer.name}</h3>
                                                  {lawyer.premium && (
                                                    <BadgeCheck className="h-4 w-4 text-indigo-400 ml-1" />
                                                  )}
                                                </div>
                                                <p className="text-sm text-gray-400">{lawyer.experience} experience</p>
                                              </div>
                                            </div>
                                            <div className="flex items-center bg-gray-900/70 px-2 py-1 rounded-lg">
                                              <Star className="h-3 w-3 text-yellow-400 mr-1" />
                                              <span className="text-xs font-medium">{lawyer.rating}</span>
                                            </div>
                                          </div>
                                          
                                          <div className="space-y-3 mb-4">
                                            <div className="flex items-center text-sm">
                                              <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                              <span>Response time: {lawyer.responseTime}</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                              <Globe className="h-4 w-4 text-gray-400 mr-2" />
                                              <span>Languages: {lawyer.languages.join(', ')}</span>
                                            </div>
                                          </div>
                                          
                                          <div className="flex flex-wrap gap-2 mb-4">
                                            {lawyer.expertise.map((skill, idx) => (
                                              <span key={idx} className="bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded text-xs">
                                                {skill}
                                              </span>
                                            ))}
                                          </div>
                                          
                                          <button className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm flex items-center justify-center opacity-90 group-hover:opacity-100">
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            <span>Start Consultation</span>
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col h-[calc(100vh-10rem)]">
                                <div className="flex items-center justify-between mb-4 p-4 bg-gray-900/80 rounded-lg">
                                  <div className="flex items-center">
                                    <div className="text-3xl mr-3">{selectedLawyer.avatar}</div>
                                    <div>
                                      <div className="flex items-center">
                                        <h3 className="font-bold">{selectedLawyer.name}</h3>
                                        {selectedLawyer.premium && (
                                          <BadgeCheck className="h-4 w-4 text-indigo-400 ml-1" />
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-400">{selectedSpecialty.name} Expert</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3">
                                    
                                    <button 
                                      onClick={endConsultation}
                                      className="flex items-center bg-gray-800 hover:bg-gray-700 py-1 px-3 rounded-lg"
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      <span className="text-sm">End Consultation</span>
                                    </button>
                                  </div>
                                </div>
                                
                                <div 
                                  ref={chatContainerRef}
                                  className="flex-grow bg-gray-900/30 rounded-lg p-4 overflow-y-auto mb-4"
                                >
                                  {messages.map((message, index) => (
                                    <div 
                                      key={index} 
                                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                                    >
                                      <div 
                                        className={`max-w-3/4 rounded-lg p-4 ${
                                          message.sender === 'user' 
                                            ? 'bg-indigo-600/60 text-white' 
                                            : 'bg-gray-800/70 text-gray-100'
                                        }`}
                                      >
                                        <p>{message.text}</p>
                                        <div className="flex justify-end mt-1">
                                          <span className="text-xs opacity-70">{message.time}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {isTyping && (
                                    <div className="flex justify-start mb-4">
                                      <div className="bg-gray-800/70 rounded-lg p-4">
                                        <div className="flex space-x-2">
                                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="relative">
                                  <div className="flex mb-2">
                                    {sampleQuestions.map((question, index) => (
                                      <button 
                                        key={index}
                                        onClick={() => handleSampleQuestion(question)}
                                        className="mr-2 text-xs py-1 px-3 rounded-full bg-gray-800 hover:bg-gray-700 whitespace-nowrap"
                                      >
                                        {question}
                                      </button>
                                    ))}
                                  </div>
                                  
                                  <div className="flex items-center bg-gray-800 rounded-lg p-2">
                                  
                                    
                                    <input 
                                      type="text" 
                                      value={inputMessage}
                                      onChange={(e) => setInputMessage(e.target.value)}
                                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                      placeholder="Type your legal question..." 
                                      className="flex-grow bg-transparent border-none outline-none px-3 py-2"
                                    />
                                    
                                   
                                    <button 
                                      onClick={sendMessage}
                                      className={`p-2 rounded-full ${
                                        inputMessage.trim() 
                                          ? 'bg-indigo-600 hover:bg-indigo-700' 
                                          : 'bg-gray-700 text-gray-400'
                                      }`}
                                    >
                                      <Send className="h-5 w-5" />
                                    </button>
                                  </div>
                                  
                                  {showChatOptions && (
                                    <div className="absolute bottom-full mb-2 w-full bg-gray-800 rounded-lg p-3">
                                      <div className="grid grid-cols-2 gap-2">
                                        <button className="flex items-center p-2 hover:bg-gray-700 rounded-lg">
                                          <Image className="h-5 w-5 mr-2 text-gray-400" />
                                          <span>Upload Images</span>
                                        </button>
                                        <button className="flex items-center p-2 hover:bg-gray-700 rounded-lg">
                                          <FileText className="h-5 w-5 mr-2 text-gray-400" />
                                          <span>Share Document</span>
                                        </button>
                                        <button className="flex items-center p-2 hover:bg-gray-700 rounded-lg">
                                          <BookOpen className="h-5 w-5 mr-2 text-gray-400" />
                                          <span>Legal Templates</span>
                                        </button>
                                        <button className="flex items-center p-2 hover:bg-gray-700 rounded-lg">
                                          <CalendarClock className="h-5 w-5 mr-2 text-gray-400" />
                                          <span>Schedule Call</span>
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        


            {activeTab === 'chat' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">All AI Assistants</h2>
                 <button 
        onClick={() => {
          setActiveTab('prepare'); // Switch to Case Preparation tab
         // setShowAIOpponentForm(true); // Show AI opponent form
        }}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
        disabled={!currentCase}
      >
        <Bot className="h-4 w-4 mr-2" />
        <span>Create New Assistant</span>
      </button>
                </div>

                {allAssistants.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allAssistants.map((assistant, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 hover:border-indigo-500 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className="bg-indigo-900/30 p-2 rounded-lg">
                            <Bot className="h-5 w-5 text-indigo-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{assistant.name}</h3>
                            <p className="text-sm text-gray-400 truncate">For case: {assistant.caseName}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                assistant.caseStatus === 'ready' ? 'bg-green-900/30 text-green-400' :
                                assistant.caseStatus === 'analyzing' ? 'bg-blue-900/30 text-blue-400' :
                                'bg-gray-700 text-gray-400'
                              }`}>
                                {assistant.caseStatus || 'Unknown'}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs bg-purple-900/30 text-purple-400">
                                {assistant.model?.model || 'Unknown model'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-gray-300 line-clamp-2">{assistant.firstMessage}</p>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                         
                          <button 
                            onClick={() => {
                              setCurrentCase(userCases.find(c => c.id === assistant.caseId));
                              setShowCourtroomModal(true);
                            }}
                            className="text-white bg-indigo-600 hover:bg-indigo-700 text-sm flex items-center px-3 py-1 rounded-lg"
                          >
                            <Scale className="h-4 w-4 mr-1" />
                            Courtroom
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 text-center">
                    <div className="mb-4">
                      <Bot className="h-10 w-10 mx-auto text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No AI Assistants Found</h3>
                    <p className="text-gray-400 mb-6">Create AI assistants for your cases to see them listed here</p>
                    <button 
                      onClick={() => setShowAIOpponentForm(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center mx-auto"
                      disabled={!currentCase}
                    >
                      <Bot className="h-5 w-5 mr-2" />
                      <span>Create First Assistant</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'prepare' && !showAIOpponentForm && (
              <div>
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Current Case</h2>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setShowNewCaseModal(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        <span>New Case</span>
                      </button>
                      
                    
                      
                      
                    </div>
                  </div>
                  {currentCase ? (
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{currentCase.name}</h3>
                            <p className="text-sm text-gray-400">Case #{currentCase.id?.substring(0, 8)}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              caseStatus === 'ready' ? 'bg-green-900/30 text-green-400' :
                              caseStatus === 'analyzing' ? 'bg-blue-900/30 text-blue-400' :
                              'bg-yellow-900/30 text-yellow-400'
                            }`}>
                              {caseStatus === 'ready' ? 'Ready for battle' :
                              caseStatus === 'analyzing' ? 'AI analyzing' :
                              'Preparing'}
                            </span>
                            <button className="text-indigo-400 hover:text-indigo-300">
                              <ChevronDown className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-900 rounded-lg p-4 mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Case Preparation Progress</span>
                            <span className="text-sm font-medium">{caseProgress}%</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full">
                            <div 
                              className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                              style={{ width: `${caseProgress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-900 rounded-lg p-4">
                            <div className="flex items-center mb-3">
                              <FileText className="h-5 w-5 text-indigo-400 mr-2" />
                              <span className="font-medium">Documents</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold">{currentCase.documents?.length || 0}</span>
                              <span className="text-sm text-gray-400">Uploaded</span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-900 rounded-lg p-4">
                            <div className="flex items-center mb-3">
                              <Brain className="h-5 w-5 text-indigo-400 mr-2" />
                              <span className="font-medium">AI Analysis</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold">
                                {caseStatus === 'ready' ? '100%' :
                                caseStatus === 'analyzing' ? `${caseProgress}%` : 
                                'Pending'}
                              </span>
                              <span className="text-sm text-gray-400">Complete</span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-900 rounded-lg p-4">
                            <div className="flex items-center mb-3">
                              <Shield className="h-5 w-5 text-indigo-400 mr-2" />
                              <span className="font-medium">Win Probability</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold">
                                {caseStatus === 'ready' ? '20%' : '—'}
                              </span>
                              <span className="text-sm text-gray-400">Estimated</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {caseStatus === 'ready' && (
                        <div className="bg-indigo-900/20 border-t border-indigo-900/30 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                              <span className="text-sm">Case analysis complete. AI opponent ready.</span>
                            </div>
                            {currentCase?.assistant_id ? (
                              <button 
                                onClick={startCall}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center"
                                disabled={callStatus === 'connecting'}
                              >
                                {callStatus === 'connecting' ? (
                                  <>
                                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                    Connecting...
                                  </>
                                ) : (
                                  <>
                                    <span>Enter Courtroom</span>
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </>
                                )}
                              </button>
                            ) : (
                              <button 
                                onClick={() => setShowAIOpponentForm(true)}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center"
                                disabled={!currentCase}
                              >
                                <Bot className="h-4 w-4 mr-2" />
                                <span>Create AI Opponent</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {caseStatus === 'analyzing' && (
                        <div className="bg-blue-900/20 border-t border-blue-900/30 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Cpu className="h-5 w-5 text-blue-400 mr-2 animate-pulse" />
                              <span className="text-sm">AI is analyzing your case documents and preparing your defense...</span>
                            </div>
                            <div className="text-sm text-blue-400">Estimated time: 2 minutes</div>
                          </div>
                        </div>
                      )}
                      
                      {caseStatus === 'preparing' && (
                        <div className="bg-yellow-900/20 border-t border-yellow-900/30 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                              <span className="text-sm">Upload additional documents to improve your case strength</span>
                            </div>
                            <button 
                              onClick={() => setShowUploadModal(true)}
                              className="bg-yellow-900/30 text-yellow-400 border border-yellow-500/30 px-4 py-2 rounded-lg flex items-center"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              <span>Upload Now</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 text-center">
                      <div className="mb-4">
                        <Brain className="h-10 w-10 mx-auto text-indigo-400" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No Active Case</h3>
                      <p className="text-gray-400 mb-6">Get started by creating a new case to prepare your legal strategy</p>
                      <button 
                        onClick={() => setShowNewCaseModal(true)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center mx-auto"
                      >
                        <PlusCircle className="h-5 w-5 mr-2" />
                        <span>Create New Case</span>
                      </button>
                    </div>
                  )}
                </div>
                
                {currentCase && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <h2 className="text-xl font-bold mb-4">Previous Cases</h2>
                      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-900/60">
                                <th className="text-left p-4">Case Name</th>
                                <th className="text-left p-4">Type</th>
                                <th className="text-left p-4">Status</th>
                                <th className="text-left p-4">Progress</th>
                                <th className="text-left p-4">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userCases.map((caseItem) => (
                                <tr key={caseItem.id} className="border-t border-gray-700">
                                  <td className="p-4">
                                    <div className="font-medium">{caseItem.name}</div>
                                    <div className="text-xs text-gray-400">Case #{caseItem.id?.substring(0, 8)}</div>
                                  </td>
                                  <td className="p-4">
                                    <span className="bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded text-xs">
                                      {caseItem.case_type || 'AI vs AI'}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      caseItem.status === 'ready' ? 'bg-green-900/30 text-green-400' :
                                      caseItem.status === 'analyzing' ? 'bg-blue-900/30 text-blue-400' :
                                      'bg-gray-700 text-gray-400'
                                    }`}>
                                      {caseItem.status === 'ready' ? 'Ready' :
                                      caseItem.status === 'analyzing' ? 'Analyzing' : 'Preparing'}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center">
                                      <div className="w-24 h-2 bg-gray-700 rounded-full mr-2">
                                        <div 
                                          className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                          style={{ width: `${caseItem.progress || 0}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-xs">{caseItem.progress || 0}%</span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <button 
                                      onClick={() => handleCaseSelection(caseItem.id)}
                                      className="text-indigo-400 hover:text-indigo-300 text-sm"
                                    >
                                      View Details
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
                        <div className="space-y-4">
                          {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-start">
                              <div className="mr-3 mt-1 p-2 bg-indigo-900/30 rounded-full">
                                {activity.icon}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{activity.action}</p>
                                <p className="text-xs text-gray-400">{activity.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">AI Tips</h2>
                          <button className="text-indigo-400 hover:text-indigo-300 text-sm">View All</button>
                        </div>
                        
                        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
                          <div className="space-y-4">
                            <div className="p-3 bg-indigo-900/20 border border-indigo-800/30 rounded-lg">
                              <div className="flex items-center mb-2">
                                <Sparkles className="h-4 w-4 text-indigo-400 mr-2" />
                                <span className="text-sm font-medium">Document Organization</span>
                              </div>
                              <p className="text-xs text-gray-300">Group your case documents by topic to improve AI analysis accuracy</p>
                            </div>
                            
                            <div className="p-3 bg-indigo-900/20 border border-indigo-800/30 rounded-lg">
                              <div className="flex items-center mb-2">
                                <Sparkles className="h-4 w-4 text-indigo-400 mr-2" />
                                <span className="text-sm font-medium">Case Weaknesses</span>
                              </div>
                              <p className="text-xs text-gray-300">Train your AI to anticipate opposing counsels arguments</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">All Case Documents</h2>
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    <span>Upload New Document</span>
                  </button>
                </div>

                {allDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allDocuments.map((document, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 hover:border-indigo-500 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className="bg-indigo-900/30 p-2 rounded-lg">
                            <FileText className="h-5 w-5 text-indigo-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{document.name}</h3>
                            <p className="text-sm text-gray-400 truncate">From case: {document.caseName}</p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{new Date(document.uploaded_at).toLocaleDateString()}</span>
                              <span className="mx-2">•</span>
                              <span>{(document.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <a 
                            href={document.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                          >
                            <ArrowRight className="h-4 w-4 mr-1" />
                            Open
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 text-center">
                    <div className="mb-4">
                      <Upload className="h-10 w-10 mx-auto text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Documents Found</h3>
                    <p className="text-gray-400 mb-6">Upload documents to your cases to see them listed here</p>
                    <button 
                      onClick={() => setShowUploadModal(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center mx-auto"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      <span>Upload First Document</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'prepare' && showAIOpponentForm && (
              <div>
                <div className="flex items-center mb-6">
                  <button 
                    onClick={() => setShowAIOpponentForm(false)}
                    className="mr-3 p-2 rounded-lg hover:bg-gray-800"
                  >
                    <ArrowRight className="h-5 w-5 transform rotate-180" />
                  </button>
                  <h2 className="text-2xl font-bold">Create AI Legal Opponent</h2>
                </div>
                
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-1">Basic Information</h3>
                    <p className="text-sm text-gray-400 mb-4">Set up your AI opponents personality and capabilities</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Assistant Name</label>
                        <input 
                          type="text" 
                          value={assistant.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500"
                          placeholder="AI Legal Assistant"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">AI Model</label>
                        <select 
                          value={assistant.model.model}
                          onChange={(e) => handleNestedInputChange('model', 'model', e.target.value)}
                          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500"
                        >
                          <option value="gpt-4o">GPT-4o (Most Powerful)</option>
  <option value="gpt-4">GPT-4</option>
  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">First Message</label>
                    <input 
                      type="text" 
                      value={assistant.firstMessage}
                      onChange={(e) => handleInputChange('firstMessage', e.target.value)}
                      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500"
                      placeholder="Hello, I am your AI legal assistant..."
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Assistant Instructions</label>
                    <textarea 
                      value={assistant.model.messages[0].content}
                      onChange={(e) => handleSystemPromptChange(e.target.value)}
                      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 min-h-32"
                      placeholder="You are an expert legal AI assistant..."
                    ></textarea>
                    <p className="text-xs text-gray-400 mt-1">These instructions tell the AI how to behave and what knowledge to draw upon</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-1">Knowledge Base</h3>
                    <p className="text-sm text-gray-400 mb-4">Upload documents to give your AI opponent specialized knowledge</p>
                    
                    <div 
                      className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      {file ? (
                        <div>
                          <CheckCircle className="h-8 w-8 mx-auto text-green-400 mb-2" />
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          
                          {!uploading && uploadStatus !== 'success' && (
                            <button
                              onClick={handleDocumentUpload}
                              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                            >
                              Upload File
                            </button>
                          )}
                          
                          {uploading && (
                            <div className="mt-4">
                              <div className="h-2 bg-gray-700 rounded-full">
                                <div 
                                  className="h-2 bg-indigo-500 rounded-full transition-all"
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                              <p className="text-sm mt-2">{uploadProgress}% Uploaded</p>
                            </div>
                          )}
                          
                          {uploadStatus === 'success' && (
                            <div className="mt-4 text-green-400 flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              <span>Upload complete!</span>
                            </div>
                          )}
                          
                          {uploadStatus === 'error' && (
                            <div className="mt-4 text-red-400 flex items-center justify-center">
                              <XCircle className="h-4 w-4 mr-2" />
                              <span>Upload failed. Try again.</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="font-medium">Drag and drop files here</p>
                          <p className="text-sm text-gray-400 mb-4">or</p>
                          <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg cursor-pointer">
                            Browse Files
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={handleFileSelect}
                              accept=".pdf,.doc,.docx,.txt"
                            />
                          </label>
                          <p className="text-xs text-gray-400 mt-4">Supported file types: PDF, DOC, DOCX, TXT</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
               
                    
                  
                  <div className="flex justify-end space-x-3">
                    <button 
                      onClick={() => setShowAIOpponentForm(false)}
                      className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={createAssistant}
                      disabled={isLoading}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Bot className="h-4 w-4 mr-2" />
                          Create AI Opponent
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Success Alert */}
                {showSuccessAlert && (
                  <div className="mt-4 bg-green-900/30 border border-green-500/30 text-green-400 p-4 rounded-lg flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <div>
                      <p className="font-medium">Success!</p>
                      <p className="text-sm">Your AI opponent has been created successfully.</p>
                    </div>
                  </div>
                )}
                
                {/* Error Alert */}
                {showErrorAlert && (
                  <div className="mt-4 bg-red-900/30 border border-red-500/30 text-red-400 p-4 rounded-lg flex items-center">
                    <XCircle className="h-5 w-5 mr-2" />
                    <div>
                      <p className="font-medium">Error</p>
                      <p className="text-sm">{errorMessage}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
           {activeTab !== 'prepare' && activeTab !== 'documents' && activeTab !== 'chat' && activeTab !== 'analytics' && activeTab !== 'research' && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="bg-indigo-900/30 p-4 rounded-full inline-block mb-4">
                    <Settings className="h-8 w-8 text-indigo-400 animate-spin-slow" />
                  </div>
                  <h3 className="text-xl font-bold">Coming Soon</h3>
                  <p className="text-gray-400 mt-2">This feature is currently under development</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Document Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Upload Case Documents</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-1 hover:bg-gray-800 rounded-full"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-400">Upload your case documents to help the AI analyze and prepare your legal strategy</p>
            </div>
            
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center mb-6">
              {file ? (
                <div>
                  <CheckCircle className="h-8 w-8 mx-auto text-green-400 mb-2" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  
                  {!uploading && uploadStatus !== 'success' && (
                    <button
                      onClick={handleDocumentUpload}
                      className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                    >
                      Upload File
                    </button>
                  )}
                  
                  {uploading && (
                    <div className="mt-4">
                      <div className="h-2 bg-gray-700 rounded-full">
                        <div 
                          className="h-2 bg-indigo-500 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm mt-2">{uploadProgress}% Uploaded</p>
                    </div>
                  )}
                  
                  {uploadStatus === 'success' && (
                    <div className="mt-4 text-green-400 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Upload complete!</span>
                    </div>
                  )}
                  
                  {uploadStatus === 'error' && (
                    <div className="mt-4 text-red-400 flex items-center justify-center">
                      <XCircle className="h-4 w-4 mr-2" />
                      <span>Upload failed. Try again.</span>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="font-medium">Drag and drop files here</p>
                  <p className="text-sm text-gray-400 mb-4">or</p>
                  <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg cursor-pointer">
                    Browse Files
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-4">Supported file types: PDF, DOC, DOCX, TXT</p>
                </>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowUploadModal(false);
                  setFile(null);
                  setUploadStatus(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleDocumentUpload}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={!file || uploading}
              >
                {uploading ? 'Uploading...' : 'Upload & Analyze'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      
      
      {/* Courtroom Modal */}
      {showCourtroomModal && (
        <div className="fixed inset-0 bg-gray-900 flex flex-col z-50">
          {/* Courtroom Header with Back Button */}
          <div className="p-4 border-b border-indigo-900/30 bg-gray-900/90 flex justify-between items-center">
            <button 
              onClick={endCall}
              className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ArrowRight className="h-5 w-5 mr-2 transform rotate-180" />
              Back to Case
            </button>
            
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                callStatus === 'active' ? 'bg-green-900/30 text-green-400' :
                callStatus === 'connecting' ? 'bg-blue-900/30 text-blue-400' :
                'bg-gray-700 text-gray-400'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  callStatus === 'active' ? 'bg-green-400' :
                  callStatus === 'connecting' ? 'bg-blue-400 animate-pulse' :
                  'bg-gray-400'
                }`}></div>
                {callStatus === 'active' ? 'Session Active' : 
                 callStatus === 'connecting' ? 'Connecting' : 
                 'Disconnected'}
              </div>
              
              <button 
                onClick={() => {
                  endCall();
                  setShowCourtroomModal(false);
                }}
                className="px-4 py-2 bg-red-900/30 hover:bg-red-900/40 text-red-400 rounded-lg flex items-center transition-colors"
              >
                <PhoneOff className="h-4 w-4 mr-2" />
                End Session
              </button>
            </div>
          </div>

          {/* Main Courtroom Area */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Panel - Courtroom View */}
            <div className="w-full md:w-2/5 bg-gray-900/70 border-r border-indigo-900/30 p-6 flex flex-col items-center justify-center">
              <div className="w-full max-w-md space-y-8">
                {/* Judge's Bench */}
                <div className="bg-gradient-to-b from-amber-900/10 to-amber-900/5 border border-amber-900/30 rounded-2xl p-6 text-center shadow-lg">
                  <div className="mx-auto w-16 h-16 bg-amber-900/20 rounded-full flex items-center justify-center mb-3 border-2 border-amber-900/30">
                    <Scale className="h-8 w-8 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold text-amber-100">Honorable Judge</h3>
                  <p className="text-sm text-amber-400">AI Arbitration Panel</p>
                </div>

                {/* Opposing Counsel Table */}
                <div className={`bg-gradient-to-b from-indigo-900/10 to-indigo-900/5 border rounded-2xl p-6 transition-all duration-300 ${
                  callStatus === 'active' ? 'border-indigo-500/50 shadow-lg' : 'border-indigo-900/30'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-indigo-900/30 border-2 border-indigo-500/50 flex items-center justify-center">
                        <Bot className="h-6 w-6 text-indigo-300" />
                      </div>
                      {callStatus === 'active' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{assistant.name}</h3>
                      <p className="text-sm text-indigo-300">AI Legal Opponent</p>
                      <p className="text-xs text-indigo-400 mt-1">{assistant.firstMessage}</p>
                    </div>
                  </div>
                </div>

                {/* Your Table */}
                <div className={`bg-gradient-to-b from-purple-900/10 to-purple-900/5 border rounded-2xl p-6 transition-all duration-300 ${
                  callStatus === 'active' && !isMuted ? 'border-purple-500/50 shadow-lg' : 'border-purple-900/30'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-purple-900/30 border-2 border-purple-500/50 flex items-center justify-center">
                        <User className="h-6 w-6 text-purple-300" />
                      </div>
                      {callStatus === 'active' && !isMuted && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Your Defense</h3>
                      <p className="text-sm text-purple-300">Attorney: {user?.fullName || 'You'}</p>
                      <div className="mt-3">
                        <button 
                          onClick={toggleMute}
                          className={`px-3 py-1 rounded-full text-xs flex items-center ${
                            isMuted ? 'bg-red-900/30 text-red-400' : 'bg-purple-900/30 text-purple-400'
                          }`}
                        >
                          <Mic className="h-3 w-3 mr-1" />
                          {isMuted ? 'Microphone Muted' : 'Microphone Active'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* New Case Button */}
             
            </div>

            {/* Right Panel - Transcript and Documents */}
            <div className="flex-1 flex flex-col bg-gray-900/50">
              {/* Transcript Header */}
              <div className="p-4 border-b border-indigo-900/30 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-indigo-400" />
                  Case Proceedings
                </h3>
                <div className="text-xs text-indigo-400">
                  {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
                </div>
              </div>

              {/* Transcript Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-900/20">
                {transcript ? (
                  transcript.split('\n').filter(line => line.trim()).map((line, i) => (
                    <div 
                      key={i} 
                      className={`flex ${line.startsWith('AI:') ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl p-4 ${line.startsWith('AI:') ? 
                        'bg-indigo-900/30 border border-indigo-900/30' : 
                        'bg-purple-900/30 border border-purple-900/30'}`}
                      >
                        <div className="text-xs font-semibold mb-1 text-indigo-300">
                          {line.startsWith('AI:') ? assistant.name : 'You'}
                        </div>
                        <p className="text-sm text-white">
                          {line.replace(/^(AI:|You:)/, '').trim()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <MessageSquare className="h-12 w-12 text-gray-700 mb-4" />
                    <h4 className="text-xl font-bold text-gray-400 mb-2">
                      {callStatus === 'connecting' ? 'Establishing Court Session' : 'No Proceedings Yet'}
                    </h4>
                    <p className="text-gray-500 max-w-md">
                      {callStatus === 'connecting' ? 
                       'Connecting to the virtual courtroom...' : 
                       'The transcript of your legal proceedings will appear here.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Case Documents */}
             
          
            </div>
          </div>
        </div>
      )}
    </div>
  );
}