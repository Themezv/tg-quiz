import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import type { Question } from '../../model/Question';
import type { QuestionState } from '../../model/QuizState';
import { getCurrentQuestion, resetState, startNextQuestion, stopCurrentQuestion } from '../lib/api';
import { Link } from 'react-router-dom';

enum QuizStatus {
    NOT_STARTED = 'NOT_STARTED',
    QUESTION_ACTIVE = 'QUESTION_ACTIVE',
    WAITING_NEXT_QUESTION = 'WAITING_NEXT_QUESTION',
    FINISHED = 'FINISHED',
    LOADING = 'LOADING',
}

export function AdminPage() {
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [currentQuestionState, setCurrentQuestionState] = useState<QuestionState>('STOPPED');
    const [hasNextQuestion, setHasNextQuestion] = useState(false);
    const [activeUsers, setActiveUsers] = useState(0);
    const [questionsCount, setQuestionsCount] = useState(0);
    const [isLoading, setLoading] = useState(true);

    const start = () => {
        setLoading(true);
        startNextQuestion().then(data => {
            setLoading(false);
            setCurrentQuestion(data.question);
            setHasNextQuestion(data.hasNextQuestion);
            setCurrentQuestionState(data.state);
        });
    };

    const stop = () => {
        setLoading(true);
        stopCurrentQuestion().then(data => {
            setLoading(false);
            setCurrentQuestionState(data.state);
        });
    };

    const reset = () => {
        setLoading(true);
        resetState().then(data => {
            setLoading(false);
            setCurrentQuestion(data.question);
            setCurrentQuestionState(data.state);
            setHasNextQuestion(data.hasNextQuestion);
        });
    };

    useEffect(() => {
        getCurrentQuestion().then(data => {
            setLoading(false);
            setCurrentQuestion(data.question);
            setCurrentQuestionState(data.state);
            setHasNextQuestion(data.hasNextQuestion);
            setActiveUsers(data.usersCount);
            setQuestionsCount(data.questionsCount);
        });
    }, []);

    const quizStatus = getQuizStatus(currentQuestion, currentQuestionState, hasNextQuestion, isLoading);

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Quiz Admin Panel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Quiz Status:</span>
                        <Badge className={`${getStatusColor(quizStatus)} text-white`}>{quizStatus}</Badge>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Active Users:</span>
                        <span>{activeUsers}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Progress:</span>
                        <span>
                            {(currentQuestion?.index ?? -1) + 1} / {questionsCount}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <span className="font-semibold">Current Question:</span>
                        <p className="p-2 bg-gray-100 rounded">{currentQuestion?.title ?? 'No question available'}</p>
                    </div>

                    {hasNextQuestion && currentQuestionState === 'STOPPED' && (
                        <Button onClick={start} className="w-full" disabled={isLoading}>
                            Запустить следующий вопрос
                        </Button>
                    )}

                    {currentQuestionState === 'ON_AIR' && (
                        <Button onClick={stop} className="w-full" disabled={isLoading}>
                            Остановить сбор ответов
                        </Button>
                    )}

                    <Link to="/" className="block text-center text-blue-500 hover:underline">
                        View Leaderboard
                    </Link>
                </CardContent>
            </Card>

            {quizStatus === QuizStatus.FINISHED && (
                <div className="flex justify-center">
                    <Button variant="link" onClick={reset}>
                        Reset state
                    </Button>
                </div>
            )}
        </div>
    );
}

function getStatusColor(status: QuizStatus) {
    switch (status) {
        case QuizStatus.LOADING:
            return 'bg-gray-500';
        case QuizStatus.NOT_STARTED:
        case QuizStatus.WAITING_NEXT_QUESTION:
            return 'bg-yellow-500';
        case QuizStatus.QUESTION_ACTIVE:
            return 'bg-green-500';
        case QuizStatus.FINISHED:
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
    }
}

function getQuizStatus(
    currentQuestion: Question | null,
    currentQuestionState: QuestionState,
    hasNextQuestion: boolean,
    isLoading: boolean
) {
    if (isLoading) {
        return QuizStatus.LOADING;
    }

    if (currentQuestionState === 'ON_AIR') {
        return QuizStatus.QUESTION_ACTIVE;
    }

    if (!hasNextQuestion) {
        return QuizStatus.FINISHED;
    }

    if (currentQuestion) {
        return QuizStatus.WAITING_NEXT_QUESTION;
    }

    return QuizStatus.NOT_STARTED;
}
