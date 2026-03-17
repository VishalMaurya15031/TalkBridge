import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-5xl space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <BellIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-base-content/70 max-w-md mx-auto">
            Stay connected with your language learning community
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-base-content/60">Loading notifications...</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Friend Requests Section */}
            {incomingRequests.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <UserCheckIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Friend Requests</h2>
                      <p className="text-sm text-base-content/70">People who want to connect with you</p>
                    </div>
                  </div>
                  <div className="badge badge-primary badge-lg font-semibold px-4 py-3">
                    {incomingRequests.length}
                  </div>
                </div>

                <div className="grid gap-4 sm:gap-6">
                  {incomingRequests.map((request, index) => (
                    <div
                      key={request._id}
                      className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-base-300/50"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="card-body p-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="avatar">
                              <div className="w-16 h-16 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100">
                                <img 
                                  src={request.sender.profilePic} 
                                  alt={request.sender.fullName}
                                  className="rounded-full object-cover"
                                />
                              </div>
                            </div>
                            <div className="space-y-2 flex-1">
                              <h3 className="font-bold text-lg">{request.sender.fullName}</h3>
                              <div className="flex flex-wrap gap-2">
                                <div className="badge badge-secondary gap-1 px-3 py-2">
                                  <span className="font-medium">Native:</span>
                                  <span>{request.sender.nativeLanguage}</span>
                                </div>
                                <div className="badge badge-outline gap-1 px-3 py-2">
                                  <span className="font-medium">Learning:</span>
                                  <span>{request.sender.learningLanguage}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-lg px-8 shadow-lg hover:shadow-xl transition-all duration-200"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            {isPending ? (
                              <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                              "Accept"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* New Connections Section */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <BellIcon className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">New Connections</h2>
                    <p className="text-sm text-base-content/70">Recent friend request acceptances</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {acceptedRequests.map((notification, index) => (
                    <div 
                      key={notification._id} 
                      className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300 border border-base-300/50"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <div className="card-body p-5">
                        <div className="flex items-start gap-4">
                          <div className="avatar">
                            <div className="w-12 h-12 rounded-full ring-2 ring-success/20 ring-offset-2 ring-offset-base-100">
                              <img
                                src={notification.recipient.profilePic}
                                alt={notification.recipient.fullName}
                                className="rounded-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <h3 className="font-bold text-lg">{notification.recipient.fullName}</h3>
                            <p className="text-base-content/80">
                              <span className="font-semibold">{notification.recipient.fullName}</span> accepted your friend request
                            </p>
                            <div className="flex items-center gap-2 text-sm text-base-content/60">
                              <ClockIcon className="h-4 w-4" />
                              <span>Recently</span>
                            </div>
                          </div>
                          <div className="badge badge-success gap-2 px-4 py-3 font-semibold">
                            <MessageSquareIcon className="h-4 w-4" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <div className="py-16">
                <NoNotificationsFound />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;