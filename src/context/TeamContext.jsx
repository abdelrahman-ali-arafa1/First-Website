import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const TeamContext = createContext(null);

export function useTeam() {
  return useContext(TeamContext);
}

const STORAGE_KEY = 'studentDesign_teams';

export function TeamProvider({ children }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Initialize teams from localStorage
  useEffect(() => {
    const storedTeams = localStorage.getItem(STORAGE_KEY);
    if (storedTeams) {
      try {
        setTeams(JSON.parse(storedTeams));
      } catch (error) {
        console.error('Failed to parse stored teams data', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Save teams to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
    }
  }, [teams, loading]);

  // Get teams where current user is a member
  const getUserTeams = useCallback(() => {
    if (!currentUser) return [];
    return teams.filter(team => 
      team.members.some(member => member.userId === currentUser.id)
    );
  }, [currentUser, teams]);

  // Create a new team
  const createTeam = useCallback((teamData) => {
    return new Promise((resolve, reject) => {
      if (!currentUser) return reject(new Error('User must be logged in to create a team'));
      
      setTimeout(() => {
        const newTeam = {
          id: `team_${Date.now()}`,
          createdAt: new Date().toISOString(),
          members: [{
            userId: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            role: 'admin',
            joinedAt: new Date().toISOString()
          }],
          ...teamData
        };
        
        setTeams(prevTeams => [...prevTeams, newTeam]);
        resolve(newTeam);
      }, 500);
    });
  }, [currentUser]);

  // Get a team by ID
  const getTeamById = useCallback((teamId) => {
    return teams.find(team => team.id === teamId) || null;
  }, [teams]);

  // Update team details
  const updateTeam = useCallback((teamId, updates) => {
    return new Promise((resolve, reject) => {
      if (!currentUser) return reject(new Error('User must be logged in'));
      
      const teamIndex = teams.findIndex(team => team.id === teamId);
      
      if (teamIndex === -1) {
        return reject(new Error('Team not found'));
      }
      
      const team = teams[teamIndex];
      
      // Check if user is team admin
      const userMember = team.members.find(member => member.userId === currentUser.id);
      if (!userMember || userMember.role !== 'admin') {
        return reject(new Error('Only team admins can update team details'));
      }
      
      const updatedTeam = { ...team, ...updates, updatedAt: new Date().toISOString() };
      
      const updatedTeams = [...teams];
      updatedTeams[teamIndex] = updatedTeam;
      
      setTeams(updatedTeams);
      resolve(updatedTeam);
    });
  }, [currentUser, teams]);

  // Invite a user to join team
  const inviteToTeam = useCallback((teamId, userEmail) => {
    return new Promise((resolve, reject) => {
      if (!currentUser) return reject(new Error('User must be logged in'));
      
      // Find the team
      const teamIndex = teams.findIndex(team => team.id === teamId);
      
      if (teamIndex === -1) {
        return reject(new Error('Team not found'));
      }
      
      const team = teams[teamIndex];
      
      // Check if user is team admin
      const userMember = team.members.find(member => member.userId === currentUser.id);
      if (!userMember || userMember.role !== 'admin') {
        return reject(new Error('Only team admins can invite members'));
      }
      
      // In a real app, this would send an email invitation
      // For demo purposes, we'll just add to a pending invitations array
      
      const updatedTeam = { 
        ...team, 
        pendingInvitations: [...(team.pendingInvitations || []), {
          email: userEmail,
          invitedBy: currentUser.id,
          invitedAt: new Date().toISOString()
        }]
      };
      
      const updatedTeams = [...teams];
      updatedTeams[teamIndex] = updatedTeam;
      
      setTeams(updatedTeams);
      resolve(updatedTeam);
    });
  }, [currentUser, teams]);

  // Join a team (accept invitation)
  const joinTeam = useCallback((teamId) => {
    return new Promise((resolve, reject) => {
      if (!currentUser) return reject(new Error('User must be logged in'));
      
      // Find the team
      const teamIndex = teams.findIndex(team => team.id === teamId);
      
      if (teamIndex === -1) {
        return reject(new Error('Team not found'));
      }
      
      const team = teams[teamIndex];
      
      // Check if user is already a member
      if (team.members.some(member => member.userId === currentUser.id)) {
        return reject(new Error('User is already a member of this team'));
      }
      
      // Check if there's an invitation for this user
      // In a real app with a backend, this would validate against the actual invitation
      // For demo, we'll just assume the invitation exists if the team exists
      
      // Add user as member
      const updatedMembers = [
        ...team.members,
        {
          userId: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          role: 'editor', // Default role for new members
          joinedAt: new Date().toISOString()
        }
      ];
      
      const updatedTeam = { ...team, members: updatedMembers };
      
      const updatedTeams = [...teams];
      updatedTeams[teamIndex] = updatedTeam;
      
      setTeams(updatedTeams);
      resolve(updatedTeam);
    });
  }, [currentUser, teams]);

  // Change a member's role
  const updateMemberRole = useCallback((teamId, userId, newRole) => {
    return new Promise((resolve, reject) => {
      if (!currentUser) return reject(new Error('User must be logged in'));
      
      const teamIndex = teams.findIndex(team => team.id === teamId);
      
      if (teamIndex === -1) {
        return reject(new Error('Team not found'));
      }
      
      const team = teams[teamIndex];
      
      // Check if current user is admin
      const currentUserMember = team.members.find(member => member.userId === currentUser.id);
      if (!currentUserMember || currentUserMember.role !== 'admin') {
        return reject(new Error('Only team admins can change member roles'));
      }
      
      // Update the role of the specified member
      const updatedMembers = team.members.map(member => {
        if (member.userId === userId) {
          return { ...member, role: newRole };
        }
        return member;
      });
      
      const updatedTeam = { ...team, members: updatedMembers };
      
      const updatedTeams = [...teams];
      updatedTeams[teamIndex] = updatedTeam;
      
      setTeams(updatedTeams);
      resolve(updatedTeam);
    });
  }, [currentUser, teams]);

  // Remove a member from team
  const removeMember = useCallback((teamId, userId) => {
    return new Promise((resolve, reject) => {
      if (!currentUser) return reject(new Error('User must be logged in'));
      
      const teamIndex = teams.findIndex(team => team.id === teamId);
      
      if (teamIndex === -1) {
        return reject(new Error('Team not found'));
      }
      
      const team = teams[teamIndex];
      
      // Check if current user is admin or is removing themselves
      const currentUserMember = team.members.find(member => member.userId === currentUser.id);
      const isAdmin = currentUserMember && currentUserMember.role === 'admin';
      const isSelfRemoval = userId === currentUser.id;
      
      if (!isAdmin && !isSelfRemoval) {
        return reject(new Error('Only admins can remove other members'));
      }
      
      // Count admins in the team
      const adminCount = team.members.filter(member => member.role === 'admin').length;
      
      // If removing the last admin, reject
      if (isAdmin && adminCount === 1 && userId === currentUser.id) {
        return reject(new Error('Cannot remove the last admin. Transfer admin role first.'));
      }
      
      // Remove the member
      const updatedMembers = team.members.filter(member => member.userId !== userId);
      
      const updatedTeam = { ...team, members: updatedMembers };
      
      const updatedTeams = [...teams];
      updatedTeams[teamIndex] = updatedTeam;
      
      setTeams(updatedTeams);
      resolve(updatedTeam);
    });
  }, [currentUser, teams]);

  const value = {
    teams,
    loading,
    getUserTeams,
    createTeam,
    getTeamById,
    updateTeam,
    inviteToTeam,
    joinTeam,
    updateMemberRole,
    removeMember
  };

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
} 