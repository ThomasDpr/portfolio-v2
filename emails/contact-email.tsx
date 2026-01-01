import * as React from 'react'
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components'

type ContactEmailProps = {
    name: string
    email: string
    subject: string
    message: string
    projectType?: string
    budget?: string
}

export default function ContactEmail({
    name,
    email,
    subject,
    message,
    projectType,
    budget,
}: ContactEmailProps) {
    return (
        <Html lang="fr">
            <Head />
            <Preview>📬 Nouveau message : {subject}</Preview>
            <Body style={{ backgroundColor: '#f5f5f5', margin: 0, padding: 0 }}>
                <Container style={{ padding: '20px 0' }}>
                    <Section style={{ backgroundColor: '#111827', padding: 24, borderRadius: 8 }}>
                        <Heading style={{ color: '#fff', margin: 0, fontSize: 18 }}>
                            📬 Nouveau message
                        </Heading>
                    </Section>

                    <Section
                        style={{
                            backgroundColor: '#fff',
                            padding: 24,
                            borderRadius: 8,
                            marginTop: 12,
                        }}
                    >
                        <Text>
                            <strong>Nom :</strong> {name}
                        </Text>
                        <Text>
                            <strong>Email :</strong> <Link href={`mailto:${email}`}>{email}</Link>
                        </Text>
                        <Text>
                            <strong>Sujet :</strong> {subject}
                        </Text>
                        {projectType ? (
                            <Text>
                                <strong>Type :</strong> {projectType}
                            </Text>
                        ) : null}
                        {budget ? (
                            <Text>
                                <strong>Budget :</strong> {budget}
                            </Text>
                        ) : null}

                        <Hr style={{ margin: '20px 0' }} />

                        <Heading as="h2" style={{ fontSize: 16, margin: 0 }}>
                            Message
                        </Heading>
                        <Text style={{ whiteSpace: 'pre-wrap' }}>{message}</Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    )
}
