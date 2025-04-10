import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeIcon, LogOutIcon, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { getSavedResumes } from '@/services/api';

interface Resume {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  saved_at: string;
  last_updated: string;
}

interface UserInfo {
  name: string;
  email: string;
  picture?: string;
}

const Dashboard: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    toast.success('Logged out successfully');
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserInfo(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchSavedResumes = async () => {
      try {
        setLoading(true);
        const data = await getSavedResumes();
        
        if (data.resumes) {
          setResumes(data.resumes);
        }
      } catch (error) {
        console.error('Error fetching saved resumes:', error);
        toast.error('Failed to load saved resumes');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchSavedResumes();
    }
  }, [userInfo]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate('/')}
            >
              <HomeIcon size={18} />
              Home
            </Button>
            <Button
              variant="destructive"
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOutIcon size={18} />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 p-6 bg-white">
          <div className="flex items-center gap-6">
            {userInfo?.picture ? (
              <img 
                src={userInfo.picture} 
                alt={userInfo.name}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <UserCircle size={80} className="text-gray-400" />
            )}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{userInfo?.name || 'User'}</h2>
              <p className="text-gray-600">{userInfo?.email}</p>
            </div>
          </div>
        </Card>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Saved Resumes</h2>
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
            >
              Upload New Resume
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : resumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <Card 
                  key={resume._id} 
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">{resume.name}</h3>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> {resume.email}</p>
                    <p><strong>Phone:</strong> {resume.phone}</p>
                    <p><strong>Location:</strong> {resume.location}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      <strong>Summary:</strong> {resume.summary}
                    </p>
                    <div>
                      <strong>Skills:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {resume.skills.map((skill, idx) => (
                          <span 
                            key={idx}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      Saved on: {new Date(resume.saved_at).toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-gray-600">No resumes saved yet.</p>
              <Button 
                className="mt-4"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Upload a Resume
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;