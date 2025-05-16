import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import { useAuth } from '../context/AuthContext';

export default function TeamDetails() {
  const { teamId } = useParams();
  const { getTeamById, updateTeam, inviteToTeam, updateMemberRole, removeMember } = useTeam();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  
  // Load team data
  useEffect(() => {
    if (!teamId) return;
    
    const loadTeam = () => {
      setLoading(true);
      try {
        const teamData = getTeamById(teamId);
        if (!teamData) {
          setError('Team not found');
          return;
        }
        setTeam(teamData);
      } catch (err) {
        setError(err.message || 'Failed to load team');
      } finally {
        setLoading(false);
      }
    };
    
    loadTeam();
  }, [teamId, getTeamById]);
  
  // Check if current user is a member of the team
  const isMember = team && currentUser && team.members.some(member => member.userId === currentUser.id);
  
  // Check if current user is an admin
  const isAdmin = team && currentUser && team.members.some(
    member => member.userId === currentUser.id && member.role === 'admin'
  );
  
  // Check if team is accessible (public or user is a member)
  const isAccessible = team && (team.visibility === 'public' || isMember);
  
  // Handle invite submission
  const handleInvite = async (e) => {
    e.preventDefault();
    
    if (!inviteEmail || !teamId || !isAdmin) return;
    
    setInviteLoading(true);
    setInviteError(null);
    setInviteSuccess(false);
    
    try {
      await inviteToTeam(teamId, inviteEmail);
      setInviteSuccess(true);
      setInviteEmail('');
      
      // Refresh team data to show pending invitation
      const updatedTeam = getTeamById(teamId);
      setTeam(updatedTeam);
    } catch (err) {
      setInviteError(err.message || 'Failed to send invitation');
    } finally {
      setInviteLoading(false);
    }
  };
  
  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    if (!teamId || !isAdmin) return;
    
    try {
      await updateMemberRole(teamId, userId, newRole);
      
      // Refresh team data
      const updatedTeam = getTeamById(teamId);
      setTeam(updatedTeam);
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };
  
  // Handle member removal
  const handleRemoveMember = async (userId) => {
    if (!teamId || (!isAdmin && userId !== currentUser?.id)) return;
    
    if (!window.confirm('Are you sure you want to remove this member from the team?')) {
      return;
    }
    
    try {
      await removeMember(teamId, userId);
      
      // If current user removed themselves, navigate away
      if (userId === currentUser?.id) {
        navigate('/teams');
        return;
      }
      
      // Refresh team data
      const updatedTeam = getTeamById(teamId);
      setTeam(updatedTeam);
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-40 bg-gray-200 rounded mb-6"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }
  
  if (error || !team) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error || 'Team not found'}</p>
            </div>
          </div>
        </div>
        <Link to="/teams" className="text-indigo-600 hover:text-indigo-900">
          ← Back to Teams
        </Link>
      </div>
    );
  }
  
  if (!isAccessible) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This team is private. You need to be a member to view its details.
              </p>
            </div>
          </div>
        </div>
        <Link to="/teams" className="text-indigo-600 hover:text-indigo-900">
          ← Back to Teams
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Team Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <img 
            src={team.avatar} 
            alt={team.name} 
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h1 className="text-3xl font-bold">{team.name}</h1>
            <p className="text-gray-500">
              {team.visibility === 'public' ? 
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  Public
                </span> : 
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">
                  Private
                </span>
              }
            </p>
          </div>
        </div>
        
        {isMember && (
          <Link 
            to={`/teams/${teamId}/projects/new`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            New Team Project
          </Link>
        )}
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-1 ${activeTab === 'overview' ? 
              'border-b-2 border-indigo-500 text-indigo-600' : 
              'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-4 px-1 ${activeTab === 'members' ? 
              'border-b-2 border-indigo-500 text-indigo-600' : 
              'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Members ({team.members.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-4 px-1 ${activeTab === 'projects' ? 
              'border-b-2 border-indigo-500 text-indigo-600' : 
              'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Projects
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-4 px-1 ${activeTab === 'settings' ? 
                'border-b-2 border-indigo-500 text-indigo-600' : 
                'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Settings
            </button>
          )}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">About this team</h2>
            <p className="text-gray-700 mb-6">{team.description}</p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Team Details</h3>
              <p className="text-sm text-gray-500">Created: {new Date(team.createdAt).toLocaleDateString()}</p>
              {team.updatedAt && (
                <p className="text-sm text-gray-500">Last updated: {new Date(team.updatedAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        )}
        
        {/* Members Tab */}
        {activeTab === 'members' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Team Members</h2>
            
            {isAdmin && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Invite New Members</h3>
                <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    disabled={inviteLoading}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${inviteLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {inviteLoading ? 'Sending...' : 'Send Invitation'}
                  </button>
                </form>
                
                {inviteError && (
                  <div className="mt-2 text-sm text-red-600">
                    {inviteError}
                  </div>
                )}
                
                {inviteSuccess && (
                  <div className="mt-2 text-sm text-green-600">
                    Invitation sent successfully!
                  </div>
                )}
                
                {team.pendingInvitations && team.pendingInvitations.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Pending Invitations</h4>
                    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                      {team.pendingInvitations.map((invitation, index) => (
                        <li key={index} className="px-4 py-3 flex justify-between items-center">
                          <span className="text-sm">{invitation.email}</span>
                          <span className="text-xs text-gray-500">
                            Invited {new Date(invitation.invitedAt).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            <ul className="divide-y divide-gray-200">
              {team.members.map((member) => (
                <li key={member.userId} className="py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">
                        {member.role === 'admin' ? 
                          <span className="text-pink-600 font-medium">Admin</span> : 
                          <span>Member</span>
                        }
                      </p>
                    </div>
                  </div>
                  
                  {isAdmin && currentUser.id !== member.userId && (
                    <div className="flex items-center space-x-3">
                      <select
                        className="mt-1 block pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                      >
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                      
                      <button
                        onClick={() => handleRemoveMember(member.userId)}
                        className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  {currentUser.id === member.userId && !isAdmin && (
                    <button
                      onClick={() => handleRemoveMember(member.userId)}
                      className="text-sm text-red-600 hover:text-red-900"
                    >
                      Leave Team
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Team Projects</h2>
              {isMember && (
                <Link 
                  to={`/teams/${teamId}/projects/new`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  New Project
                </Link>
              )}
            </div>
            
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No projects yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new team project.
              </p>
              {isMember && (
                <div className="mt-6">
                  <Link 
                    to={`/teams/${teamId}/projects/new`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    New Project
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Settings Tab (Admin only) */}
        {activeTab === 'settings' && isAdmin && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Team Settings</h2>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Team Information</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Update your team details.</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Team Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={team.name}
                        onChange={(e) => setTeam({...team, name: e.target.value})}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={team.description}
                        onChange={(e) => setTeam({...team, description: e.target.value})}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Team Visibility
                    </label>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="visibility-private"
                          name="visibility"
                          type="radio"
                          value="private"
                          checked={team.visibility === 'private'}
                          onChange={() => setTeam({...team, visibility: 'private'})}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label htmlFor="visibility-private" className="ml-3 block text-sm font-medium text-gray-700">
                          Private - Only visible to team members
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="visibility-public"
                          name="visibility"
                          type="radio"
                          value="public"
                          checked={team.visibility === 'public'}
                          onChange={() => setTeam({...team, visibility: 'public'})}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label htmlFor="visibility-public" className="ml-3 block text-sm font-medium text-gray-700">
                          Public - Anyone can view team projects
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        updateTeam(teamId, {
                          name: team.name,
                          description: team.description,
                          visibility: team.visibility
                        });
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Danger Zone</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Destructive actions for your team.</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
                      // Delete team functionality would go here
                      navigate('/teams');
                    }
                  }}
                >
                  Delete Team
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 