trap 'kill %1; kill %2;' SIGINT
../zbctl/zbctl --insecure create worker create_customer --handler cat &
../zbctl/zbctl --insecure create worker send_acception --handler cat