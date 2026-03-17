import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getUserFriends,
} from "../lib/api";
import { Link } from "react-router-dom";
import { 
  UsersIcon, 
  HeartIcon, 
  SparklesIcon, 
  SearchIcon,
  FilterIcon,
  UserCheckIcon,
  TrendingUpIcon
} from "lucide-react";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const FriendsPage = () => {
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  // Filter friends based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter(friend =>
        friend.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (friend.location && friend.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (friend.nativeLanguage && friend.nativeLanguage.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (friend.learningLanguage && friend.learningLanguage.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredFriends(filtered);
    }
  }, [friends, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200/30">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto space-y-10">
          
          {/* Enhanced Header Section */}
          <div className="relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-3xl blur-3xl animate-pulse"></div>
            <div className="absolute top-4 right-8 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }}></div>
            <div className="absolute bottom-4 left-8 w-24 h-24 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative bg-base-100/90 backdrop-blur-sm rounded-3xl border border-base-300/50 shadow-2xl p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                
                {/* Enhanced Title Section */}
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all duration-300">
                      <HeartIcon className="w-10 h-10 text-primary-content animate-pulse" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent tracking-wide">
                      Friends Circle
                    </h1>
                    <div className="flex items-center gap-3">
                      <p className="text-base-content/70 text-lg">
                        {friends.length} amazing language {friends.length === 1 ? 'partner' : 'partners'}
                      </p>
                      <div className="badge badge-primary badge-lg font-bold animate-bounce">
                        {friends.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Action Button */}
                <Link 
                  to="/notifications" 
                  className="group relative overflow-hidden btn btn-primary btn-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <div className="relative flex items-center gap-3">
                    <UsersIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    Friend Requests
                    <SparklesIcon className="w-4 h-4 animate-spin" style={{ animationDuration: '2s' }} />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Enhanced Search and Filter Section */}
          {friends.length > 0 && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-base-100/80 backdrop-blur-sm rounded-2xl border border-base-300/50 shadow-xl p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  
                  {/* Enhanced Search Input */}
                  <div className="relative flex-1 group">
                    <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40 group-focus-within:text-primary transition-colors duration-300" />
                    <input
                      type="text"
                      placeholder="Search friends by name, location, or language..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input input-bordered w-full pl-12 pr-4 h-12 bg-base-200/50 border-base-300 focus:border-primary focus:bg-base-100 transition-all duration-300 hover:shadow-md focus:shadow-lg"
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>

                  {/* Enhanced Filter Button */}
                  <button className="btn btn-outline hover:btn-primary group transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-lg">
                    <FilterIcon className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Filter</span>
                  </button>
                </div>

                {/* Enhanced Search Results Info */}
                {searchTerm && (
                  <div className="mt-4 p-3 bg-base-200/50 rounded-lg border border-base-300/30">
                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                      <UserCheckIcon className="w-4 h-4 text-success animate-pulse" />
                      <span className="font-medium">
                        {filteredFriends.length} {filteredFriends.length === 1 ? 'friend' : 'friends'} found
                        {searchTerm && (
                          <span className="text-primary ml-1">
                            for "{searchTerm}"
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Friends Grid Section */}
          <div className="relative">
            {loadingFriends ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-base-300 border-t-primary rounded-full animate-spin"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <HeartIcon className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-base-content/80 text-xl font-semibold">Loading your amazing friends...</p>
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            ) : friends.length === 0 ? (
              <div className="relative overflow-hidden rounded-3xl bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                <div className="relative">
                  <NoFriendsFound />
                </div>
              </div>
            ) : filteredFriends.length === 0 ? (
              <div className="relative overflow-hidden rounded-3xl bg-base-100/80 backdrop-blur-sm border border-base-300/50 shadow-2xl p-12 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                <div className="relative space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-base-300 to-base-content/20 rounded-full flex items-center justify-center mx-auto">
                    <SearchIcon className="w-12 h-12 text-base-content/60" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-bold text-2xl text-base-content">No friends found</h3>
                    <p className="text-base-content/70 text-lg max-w-md mx-auto">
                      No friends match your search criteria. Try adjusting your search terms.
                    </p>
                  </div>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="btn btn-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Enhanced Friends Count */}
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="badge badge-primary badge-lg font-bold shadow-lg">
                      <UserCheckIcon className="w-4 h-4 mr-1" />
                      {filteredFriends.length} {filteredFriends.length === 1 ? 'Friend' : 'Friends'}
                    </div>
                    {searchTerm && (
                      <div className="badge badge-outline animate-pulse">
                        Search Results
                      </div>
                    )}
                  </div>
                  
                  <div className="hidden sm:flex items-center gap-2 text-sm text-base-content/60">
                    <TrendingUpIcon className="w-4 h-4" />
                    <span>Growing network</span>
                  </div>
                </div>

                {/* Enhanced Friends Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredFriends.map((friend, index) => (
                    <div 
                      key={friend._id}
                      className="group animate-fade-in-up"
                      style={{ 
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <div className="relative">
                        {/* Enhanced Hover Effect Background */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm group-hover:blur-none"></div>
                        <div className="relative transform group-hover:scale-105 transition-all duration-300">
                          <FriendCard friend={friend} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Enhanced Stats Section */}
          {friends.length > 0 && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-base-100/80 backdrop-blur-sm rounded-3xl border border-base-300/50 shadow-xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-base-content mb-2">Network Statistics</h3>
                  <p className="text-base-content/70">Your learning community insights</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div className="text-center group">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-focus rounded-2xl flex items-center justify-center mx-auto shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <HeartIcon className="w-8 h-8 text-primary-content" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-base-content mb-1 counter" data-target={friends.length}>
                      {friends.length}
                    </p>
                    <p className="text-base-content/70 font-medium">Total Friends</p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-focus rounded-2xl flex items-center justify-center mx-auto shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <UsersIcon className="w-8 h-8 text-secondary-content" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-base-content mb-1">
                      {outgoingFriendReqs?.length || 0}
                    </p>
                    <p className="text-base-content/70 font-medium">Pending Requests</p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-focus rounded-2xl flex items-center justify-center mx-auto shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <SparklesIcon className="w-8 h-8 text-accent-content" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-base-content mb-1">
                      {new Set(friends.map(f => f.nativeLanguage)).size}
                    </p>
                    <p className="text-base-content/70 font-medium">Languages</p>
                  </div>
                </div>
                
                {/* Progress indicators */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/70">Network Growth</span>
                      <span className="text-primary font-semibold">85%</span>
                    </div>
                    <div className="progress progress-primary">
                      <div className="progress-bar bg-primary" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/70">Active Connections</span>
                      <span className="text-secondary font-semibold">92%</span>
                    </div>
                    <div className="progress progress-secondary">
                      <div className="progress-bar bg-secondary" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/70">Language Diversity</span>
                      <span className="text-accent font-semibold">78%</span>
                    </div>
                    <div className="progress progress-accent">
                      <div className="progress-bar bg-accent" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Custom CSS */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
          opacity: 0;
        }
        
        .progress {
          @apply w-full bg-base-300 rounded-full h-2 overflow-hidden;
        }
        
        .progress-bar {
          @apply h-full transition-all duration-1000 ease-out;
          animation: progress-fill 1.5s ease-out forwards;
        }
        
        @keyframes progress-fill {
          from {
            width: 0%;
          }
        }
        
        .counter {
          animation: counter-up 2s ease-out;
        }
        
        @keyframes counter-up {
          from {
            transform: scale(0.8);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default FriendsPage;