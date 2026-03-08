"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Divider, Input, Spinner } from "@heroui/react";
import { Copy, Trash } from "@/utils/icons";
import { getUserApiKeys, generateApiKey, deleteApiKey } from "@/actions/api-keys";

interface ApiKey {
  id: string;
  key: string;
  created_at: string;
}

export default function ApiKeysSection() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    const result = await getUserApiKeys();

    if (!result.success) {
      setErrorMessage(result.error);
      setLoading(false);
      return;
    }

    setKeys(result.apiKeys);
    setIsDeveloper(result.isDeveloper);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchKeys();
  }, [fetchKeys]);

  const handleGenerate = async () => {
    if (!isDeveloper) {
      setErrorMessage("Only users with developer status can generate API keys.");
      return;
    }

    setGenerating(true);
    setErrorMessage(null);

    const result = await generateApiKey();

    if (!result.success) {
      setErrorMessage(result.error);
      setGenerating(false);
      return;
    }

    await fetchKeys();
    setGenerating(false);
  };

  const handleDelete = async (id: string) => {
    setErrorMessage(null);

    const result = await deleteApiKey(id);

    if (!result.success) {
      setErrorMessage(result.error);
      return;
    }

    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="mt-6 w-full max-w-md bg-white/5 p-4 shadow-lg backdrop-blur-md">
      <CardHeader className="flex flex-col items-start gap-1">
        <h2 className="text-xl font-bold">API Keys</h2>
        <p className="text-muted-foreground font-mono text-xs">Manage access for developers.</p>
      </CardHeader>
      <Divider className="my-2 bg-white/10" />
      <CardBody className="flex flex-col gap-4">
        {loading ? (
          <Spinner size="sm" />
        ) : keys.length === 0 ? (
          <p className="text-muted-foreground my-2 text-center text-sm">No API keys found.</p>
        ) : (
          keys.map((k) => (
            <div key={k.id} className="flex items-center gap-2 rounded-lg bg-black/20 p-2">
              <Input
                readOnly
                size="sm"
                value={k.key}
                variant="flat"
                className="w-full font-mono text-xs"
              />
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => copyToClipboard(k.key)}
                title="Copy"
              >
                <Copy size={16} />
              </Button>
              <Button
                isIconOnly
                size="sm"
                color="danger"
                variant="flat"
                onPress={() => handleDelete(k.id)}
                title="Revoke"
              >
                <Trash size={16} />
              </Button>
            </div>
          ))
        )}
        {!loading && !isDeveloper && (
          <p className="text-warning-500 text-xs font-medium">
            Developer status is required to generate API keys.
          </p>
        )}
        {errorMessage && <p className="text-danger text-xs font-medium">{errorMessage}</p>}
        <Button
          isLoading={generating}
          isDisabled={loading || !isDeveloper}
          color="primary"
          variant="shadow"
          onPress={handleGenerate}
          className="mt-2 font-bold"
        >
          {isDeveloper ? "Generate New API Key" : "Developer Status Required"}
        </Button>
      </CardBody>
    </Card>
  );
}
