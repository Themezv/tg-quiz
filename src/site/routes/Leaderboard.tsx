import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Medal } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { LeaderBoardItem } from '../../api/api-leaderboard';
import { getLeaderboard } from '../lib/api';

export function LeaderboardPage() {
    const [users, setUsers] = useState<LeaderBoardItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLeaderboard().then(data => {
            setUsers(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8" style={{ maxWidth: '960px' }}>
            <h1 className="text-3xl font-bold mb-6 text-center">Leaderboard</h1>
            {loading ? <Loading /> : <Content users={users} />}
        </div>
    );
}

function Content({ users }: { users: LeaderBoardItem[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-12 text-center">Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user, index) => (
                    <TableRow key={user.name}>
                        <TableCell className="font-medium text-center">
                            {index < 3 ? (
                                <div className="flex justify-center">
                                    <Medal
                                        className={`w-6 h-6 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-amber-600'}`}
                                    />
                                </div>
                            ) : (
                                <div className="text-center">{index + 1}</div>
                            )}
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
                                    <AvatarFallback>
                                        {user.name
                                            .split(' ')
                                            .map(n => n[0])
                                            .join('')}
                                    </AvatarFallback>
                                </Avatar>
                                {user.name}
                            </div>
                        </TableCell>
                        <TableCell className="text-right">{user.score} pts</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function Loading() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-12 text-center">Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(10)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell className="text-center">
                            <Skeleton className="h-6 w-6 rounded-full mx-auto" />
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center">
                                <Skeleton className="h-8 w-8 rounded-full mr-2" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            <Skeleton className="h-4 w-12 ml-auto" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
