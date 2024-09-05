// api.ts

// const API_BASE_URL = 'https://elektor-api.onrender.com/api';
const API_BASE_URL = 'http://localhost:8080/api';

export interface Identity {
  did: string;
  address: string;
  createdAt: string;
  hasVoted: boolean;
  identityCredential: any;
  isDocumentUploaded: boolean;
}

interface IdentityResponse {
  did: string;
  identityCredential: any;
  message: string;
}

export interface CredentialUploadResponse {
  message: string;
  nin: string;
  dob: string;
  txId: string;
  issuedCredential: any;
}

export interface ProofResponse {
  success: boolean;
  message: string;
  data: {
    proof: any;
    pub_signals: any;
  };
}

export interface VoteResponse {
  message: string;
  transactionHash: string;
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json();
}

export async function getIdentity(token: string): Promise<Identity> {
  const response = await fetch(`${API_BASE_URL}/identity`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
}

export async function setIdentity(token: string): Promise<IdentityResponse> {
  const response = await fetch(`${API_BASE_URL}/identity`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
}

export async function uploadCredentials(token: string, file: File): Promise<CredentialUploadResponse> {
  const formData = new FormData();
  formData.append('document', file);

  const response = await fetch(`${API_BASE_URL}/upload-credentials`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return handleResponse(response);
}

export async function generateProof(token: string): Promise<ProofResponse> {
  const response = await fetch(`${API_BASE_URL}/generate-proof`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
}

export async function castVote(
  token: string,
  secret: string,
  nullifier: string,
  contestantId: number,
): Promise<VoteResponse> {
  const response = await fetch(`${API_BASE_URL}/vote`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret,
      nullifier,
      contestantId,
    }),
  });
  return handleResponse(response);
}
