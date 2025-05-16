import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import { useAuth } from '../context/AuthContext';
import { UserGroupIcon, UsersIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';

export default function Teams() {
  const { teams, getUserTeams, loading: teamsLoading } = useTeam();
  const { currentUser, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('myTeams');
  const [searchQuery, setSearchQuery] = useState('');

  // Get user's teams
  const userTeams = getUserTeams();
  
  // Filter public teams (excluding user's teams)
  const publicTeams = teams.filter(team => 
    team.visibility === 'public' && 
    !userTeams.some(userTeam => userTeam.id === team.id)
  );
  
  // Apply search filter
  const filteredUserTeams = userTeams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPublicTeams = publicTeams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || teamsLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16">
      {/* Page Header */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-16 rounded-xl overflow-hidden">
        {/* Abstract geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(15)].map((_, i) => (
              <div 
                key={i} 
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 10 + 2}rem`,
                  height: `${Math.random() * 10 + 2}rem`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.1,
                  transform: `scale(${Math.random() * 0.8 + 0.6})`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Teams</h1>
          <p className="text-primary-100 max-w-2xl mx-auto text-lg">
            Collaborate with others on design projects. Join existing teams or create your own.
          </p>
        </div>
      </div>
      
      {/* Search and Actions Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:max-w-md">
            <FormInput
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-full rounded-full pl-5"
              containerClassName="mb-0"
              icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
            />
          </div>
          
          <div className="w-full md:w-auto">
            <Link 
              to="/teams/create"
              className="flex items-center justify-center px-6 py-2.5 bg-primary-600 text-white rounded-full shadow-md hover:bg-primary-700 transition-colors w-full md:w-auto"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Team
            </Link>
          </div>
        </div>
      </div>
      
      {!currentUser && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-5 rounded-xl shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-amber-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-amber-800 font-medium">
                Sign in to create teams and collaborate with others
              </p>
              <p className="mt-1 text-amber-700">
                <Link to="/login" className="font-medium underline hover:text-amber-900">
                  Sign in
                </Link> or <Link to="/register" className="font-medium underline hover:text-amber-900">
                  Create an account
                </Link> to get started
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {currentUser && (
            <button
              onClick={() => setActiveTab('myTeams')}
              className={`pb-4 px-1 ${activeTab === 'myTeams' ? 
                'border-b-2 border-primary-600 text-primary-600 font-medium' : 
                'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <div className="flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                <span>My Teams ({userTeams.length})</span>
              </div>
            </button>
          )}
          <button
            onClick={() => setActiveTab('explore')}
            className={`pb-4 px-1 ${activeTab === 'explore' ? 
              'border-b-2 border-primary-600 text-primary-600 font-medium' : 
              'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <div className="flex items-center">
              <UsersIcon className="h-5 w-5 mr-2" />
              <span>Explore Public Teams</span>
            </div>
          </button>
        </nav>
      </div>
      
      {/* My Teams Tab */}
      {activeTab === 'myTeams' && currentUser && (
        <div>
          {filteredUserTeams.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl py-16 px-4 text-center shadow-inner">
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-md">
                  <UserGroupIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No teams yet</h3>
                <p className="text-gray-600 mb-8">
                  {searchQuery ? 'No teams match your search.' : 'Get started by creating a new team or joining an existing one.'}
                </p>
                <Link 
                  to="/teams/create"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-full shadow-md hover:bg-primary-700 transition-colors"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Team
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUserTeams.map(team => (
                <div key={team.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <img 
                          className="w-12 h-12 rounded-full bg-primary-100 object-cover" 
                          src={team.avatar || 'https://via.placeholder.com/48'} 
                          alt={team.name} 
                        />
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            team.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {team.visibility === 'public' ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="mt-1 text-gray-600 text-sm line-clamp-2 h-10 mb-4">
                      {team.description || 'No description provided'}
                    </p>
                    
                    <div className="flex -space-x-2 overflow-hidden mb-4">
                      {team.members && team.members.slice(0, 5).map((member, i) => (
                        <img 
                          key={i}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white" 
                          src={member.avatar || 'https://via.placeholder.com/32'} 
                          alt={member.name}
                        />
                      ))}
                      {team.members && team.members.length > 5 && (
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-xs font-medium text-gray-600 ring-2 ring-white">
                          +{team.members.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                    <div className="flex justify-between">
                      <Link
                        to={`/teams/${team.id}`}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        View Team
                      </Link>
                      <Link
                        to={`/teams/${team.id}/projects/new`}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        New Project
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Explore Public Teams Tab */}
      {activeTab === 'explore' && (
        <div>
          {filteredPublicTeams.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl py-16 px-4 text-center shadow-inner">
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-md">
                  <MagnifyingGlassIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No public teams found</h3>
                <p className="text-gray-600 mb-8">
                  {searchQuery ? 'No teams match your search.' : 'There are no public teams available to join at the moment.'}
                </p>
                {currentUser && (
                  <Link 
                    to="/teams/create"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-full shadow-md hover:bg-primary-700 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Team
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPublicTeams.map(team => (
                <div key={team.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <img 
                          className="w-12 h-12 rounded-full bg-primary-100 object-cover" 
                          src={team.avatar || 'https://via.placeholder.com/48'} 
                          alt={team.name} 
                        />
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Public
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="mt-1 text-gray-600 text-sm line-clamp-2 h-10 mb-4">
                      {team.description || 'No description provided'}
                    </p>
                    
                    <div className="flex -space-x-2 overflow-hidden mb-4">
                      {team.members && team.members.slice(0, 5).map((member, i) => (
                        <img 
                          key={i}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white" 
                          src={member.avatar || 'https://via.placeholder.com/32'} 
                          alt={member.name}
                        />
                      ))}
                      {team.members && team.members.length > 5 && (
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-xs font-medium text-gray-600 ring-2 ring-white">
                          +{team.members.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                    <div className="flex justify-between">
                      <Link
                        to={`/teams/${team.id}`}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        View Team
                      </Link>
                      {currentUser && (
                        <button
                          className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                          onClick={() => {/* Join team functionality */}}
                        >
                          Join Team
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 