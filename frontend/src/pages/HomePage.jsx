import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon, SparklesIcon } from "lucide-react";

import { capitialize } from "../lib/utils";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200/50">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto space-y-12">
          {/* Header Section with enhanced styling */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl blur-3xl" />
            <div className="relative bg-base-100/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-base-300/50 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text">
                    Your Learning Community
                  </h1>
                  <p className="text-base-content/60 text-sm sm:text-base">
                    Connect with {friends.length} friends and discover new language partners
                  </p>
                </div>
                <Link 
                  to="/notifications" 
                  className="btn btn-outline btn-sm hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <UsersIcon className="mr-2 size-4" />
                  Friend Requests
                  <div className="badge badge-primary badge-xs ml-2 animate-pulse" />
                </Link>
              </div>
            </div>
          </div>

          {/* Friends Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full" />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
              {friends.length > 0 && (
                <div className="badge badge-primary badge-lg font-semibold">
                  {friends.length}
                </div>
              )}
            </div>

            {loadingFriends ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="relative">
                  <span className="loading loading-spinner loading-lg text-primary" />
                  <div className="absolute inset-0 loading loading-spinner loading-lg text-secondary opacity-30 animate-spin" style={{ animationDirection: 'reverse' }} />
                </div>
                <p className="text-base-content/60 text-sm">Loading your friends...</p>
              </div>
            ) : friends.length === 0 ? (
              <div className="transform hover:scale-[1.01] transition-transform duration-300">
                <NoFriendsFound />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {friends.map((friend, index) => (
                  <div 
                    key={friend._id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <FriendCard friend={friend} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recommended Users Section */}
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <SparklesIcon className="size-6 text-primary animate-pulse" />
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet New Learners
                </h2>
                <SparklesIcon className="size-6 text-secondary animate-pulse" />
              </div>
              <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
                Discover perfect language exchange partners tailored to your learning journey
              </p>
            </div>

            {loadingUsers ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="relative">
                  <span className="loading loading-spinner loading-lg text-primary" />
                  <div className="absolute inset-0 loading loading-spinner loading-lg text-secondary opacity-30 animate-spin" style={{ animationDirection: 'reverse' }} />
                </div>
                <p className="text-base-content/60 text-sm">Finding perfect matches for you...</p>
              </div>
            ) : recommendedUsers.length === 0 ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl blur-2xl" />
                <div className="relative card bg-base-200/80 backdrop-blur-sm border border-base-300/50 shadow-xl">
                  <div className="card-body p-8 text-center space-y-4">
                    <div className="text-6xl opacity-20">🌟</div>
                    <h3 className="font-bold text-xl">No recommendations available</h3>
                    <p className="text-base-content/70">
                      Check back later for new language partners to connect with!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendedUsers.map((user, index) => {
                  const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                  return (
                    <div
                      key={user._id}
                      className="group animate-fade-in-up"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="relative">
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative card bg-base-200/90 backdrop-blur-sm border border-base-300/50 hover:border-primary/20 hover:shadow-2xl transition-all duration-300 group-hover:transform group-hover:scale-[1.02]">
                          <div className="card-body p-6 space-y-5">
                            {/* Profile Header */}
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                <div className="avatar relative">
                                  <div className="w-16 h-16 rounded-full ring-2 ring-base-300 group-hover:ring-primary/30 transition-all duration-300">
                                    <img 
                                      src={user.profilePic} 
                                      alt={user.fullName}
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-base-200 animate-pulse" />
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors duration-200">
                                  {user.fullName}
                                </h3>
                                {user.location && (
                                  <div className="flex items-center text-sm text-base-content/70 mt-1">
                                    <MapPinIcon className="size-3 mr-1 text-primary/60" />
                                    <span className="truncate">{user.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Languages with enhanced styling */}
                            <div className="flex flex-wrap gap-2">
                              <div className="badge badge-primary badge-lg font-medium shadow-sm hover:shadow-md transition-shadow duration-200">
                                <span className="mr-1 text-base">{getLanguageFlag(user.nativeLanguage)}</span>
                                Native: {capitialize(user.nativeLanguage)}
                              </div>
                              <div className="badge badge-outline badge-lg font-medium hover:badge-secondary transition-colors duration-200">
                                <span className="mr-1 text-base">{getLanguageFlag(user.learningLanguage)}</span>
                                Learning: {capitialize(user.learningLanguage)}
                              </div>
                            </div>

                            {/* Bio with better typography */}
                            {user.bio && (
                              <div className="bg-base-100/50 rounded-lg p-3 border border-base-300/30">
                                <p className="text-sm text-base-content/80 leading-relaxed line-clamp-3">
                                  {user.bio}
                                </p>
                              </div>
                            )}

                            {/* Enhanced action button */}
                            <button
                              className={`btn w-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
                                hasRequestBeenSent 
                                  ? "btn-success btn-disabled" 
                                  : "btn-primary hover:btn-primary"
                              }`}
                              onClick={() => sendRequestMutation(user._id)}
                              disabled={hasRequestBeenSent || isPending}
                            >
                              {isPending ? (
                                <>
                                  <span className="loading loading-spinner loading-sm mr-2" />
                                  Sending...
                                </>
                              ) : hasRequestBeenSent ? (
                                <>
                                  <CheckCircleIcon className="size-4 mr-2 animate-pulse" />
                                  Request Sent
                                </>
                              ) : (
                                <>
                                  <UserPlusIcon className="size-4 mr-2 group-hover:animate-bounce" />
                                  Send Friend Request
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default HomePage;