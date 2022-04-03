import {useParams} from 'solid-app-router';

export default function NotFoundPage() {
    const params = useParams();
    return <main>
        <h1>Not Found</h1>
        No route matches{' '}
        <code>
            <strong>{params.all}</strong>
        </code>
    </main>
    ;
}
